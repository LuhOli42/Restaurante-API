const utils = require("../utils/utils");
const knex = require("../db/db");
const bcrypt = require("bcrypt");

const create = async (req, res) => {
  const { nome, senha, foto, endereco, horarios, email } = req.body;
  if (!nome || !senha || !endereco || !email) {
    return res.status(400).json({
      message:
        "Nome, email, senha e endereço são campos obrigatórios, por favor preencha todos os campos",
    });
  }

  if (!utils.verificadorHorarios(horarios).verify) {
    return res
      .status(400)
      .json({ message: utils.verificadorHorarios(horarios).message });
  }

  try {
    const existeRestaurante = await knex("restaurantes")
      .where({ email })
      .first();

    if (existeRestaurante) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }
    const senhaCrypto = await bcrypt.hash(senha, 10);

    const horarioFuncionamento = await knex("horario_de_funcionamento")
      .insert(horarios)
      .returning("*");

    if (!horarioFuncionamento) {
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }

    const cadastroRestaurante = await knex("restaurantes")
      .insert({
        nome,
        senha: senhaCrypto,
        email,
        foto,
        endereco,
        horarios: horarioFuncionamento[0].id,
      })
      .returning(["nome", "email", "foto", "endereco"]);

    if (!cadastroRestaurante) {
      await knex("horario_de_funcionamento")
        .del()
        .where({ id: horarioFuncionamento.id });
      return res
        .status(400)
        .json({ message: "erro no servidor tente novamente" });
    }
    const objRestaurante = {
      ...cadastroRestaurante[0],
      horarios: { ...horarioFuncionamento[0] },
    };
    delete objRestaurante.horarios.id;

    return res.status(200).json(objRestaurante);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const list = async (req, res) => {
  try {
    const restaurantes = await knex("restaurantes")
      .join("horario_de_funcionamento as h", "restaurantes.horarios", "h.id")
      .select(
        "restaurantes.id",
        "restaurantes.email",
        "restaurantes.nome",
        "restaurantes.foto",
        "restaurantes.endereco",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .then(function (rows) {
        if (rows.length === 0) {
          return rows;
        }
        for (let x = 0; x < rows.length; x++) {
          rows[x].horariosFuncionamento = {};
          rows[x].diasFechado = [];
          for (const [key, value] of Object.entries(rows[x])) {
            if (key.split("_")[0] === "h") {
              const nome = key.split("_")[1];
              if (value) {
                rows[x].horariosFuncionamento[nome] = value;
              }
              if (!value) {
                rows[x].diasFechado.push(nome);
              }
              delete rows[x][key];
            }
          }
        }
        return rows;
      });

    if (restaurantes.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum restaurante encrontrado" });
    }
    return res.status(200).json(restaurantes);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const data = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await knex("restaurantes")
      .where("restaurantes.id", id)
      .join("horario_de_funcionamento as h", "restaurantes.horarios", "h.id")
      .select(
        "restaurantes.id",
        "restaurantes.email",
        "restaurantes.nome",
        "restaurantes.foto",
        "restaurantes.endereco",
        "h.seg as h_seg",
        "h.ter as h_ter",
        "h.qua as h_qua",
        "h.qui as h_qui",
        "h.sex as h_sex",
        "h.sab as h_sab",
        "h.dom as h_dom"
      )
      .then(function (rows) {
        if (!rows[0]) {
          return rows[0];
        }
        rows[0].horariosFuncionamento = {};
        rows[0].diasFechado = [];
        for (const [key, value] of Object.entries(rows[0])) {
          if (key.split("_")[0] === "h") {
            const nome = key.split("_")[1];
            if (value) {
              rows[0].horariosFuncionamento[nome] = value;
            }
            if (!value) {
              rows[0].diasFechado.push(nome);
            }
            delete rows[0][key];
          }
        }
        return rows[0];
      });

    if (!restaurante) {
      return res
        .status(404)
        .json({ message: "Nenhum restaurante encrontrado" });
    }

    return res.status(200).json(restaurante);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const update = async (req, res) => {
  const { nome, foto, endereco, horarios, email } = req.body;
  let { senha } = req.body;
  const { id } = req.restaurant;
  if (!nome && !senha && !endereco && !email) {
    return res.status(400).json({
      message:
        "Prenchimento de um dos campos é obrigatório, por favor preencha um dos campos",
    });
  }
  if (horarios) {
    if (!utils.verificadorHorarios(horarios).verify) {
      return res
        .status(400)
        .json({ message: utils.verificadorHorarios(horarios).message });
    }
  }
  try {
    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }
    if (email !== req.restaurant.email) {
      const existeRestaurante = await knex("restaurantes")
        .where({ email })
        .first();

      if (existeRestaurante) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }
    }
    let tabelaIdHorario = undefined;
    if (horarios) {
      const horarioFuncionamento = await knex("horario_de_funcionamento")
        .insert(horarios)
        .returning("*");

      if (!horarioFuncionamento) {
        return res
          .status(400)
          .json({ message: "erro no servidor tente novamente" });
      }
      tabelaIdHorario = horarioFuncionamento[0].id;
    }

    const tabelaHorarioDeletar = await knex("restaurantes")
      .where({ id })
      .first();
    const restauranteAtualizado = await knex("restaurantes")
      .where({ id })
      .update({ nome, foto, endereco, horarios: tabelaIdHorario, email });

    if (!restauranteAtualizado) {
      return res
        .status(400)
        .json({ mensagem: "O restaurante não foi atualizado" });
    }

    if (horarios) {
      await knex("horario_de_funcionamento")
        .where({ id: tabelaHorarioDeletar.horarios })
        .del();
    }

    return res.status(200).json({
      mensagem: "Restaurante atualizado com sucesso",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const del = async (req, res) => {
  const { id } = req.restaurant;
  try {
    const tabelaHorarioDeletar = await knex("restaurantes")
      .where({ id })
      .first();
    await knex("restaurantes").where({ id }).del();
    await knex("horario_de_funcionamento")
      .where({ id: tabelaHorarioDeletar.horarios })
      .del();

    return res
      .status(200)
      .json({ messagem: "Restaurante deletado com sucesso" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  create,
  data,
  update,
  del,
  list,
};
