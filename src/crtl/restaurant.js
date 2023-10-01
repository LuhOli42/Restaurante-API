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
  const verificar = utils.verificadorHorarios(horarios);

  if (!verificar[0]) {
    return res.status(400).json({ message: verificar[1] });
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
    return res.status(500).json(error.message);
  }
};

const list = async (req, res) => {
  try {
    const restaurantes = await knex("restaurantes").select([
      "id",
      "email",
      "nome",
      "foto",
      "endereco",
    ]);

    if (restaurantes.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum restaurante encrontrado" });
    }
    return res.status(200).json(restaurantes);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const data = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await knex("restaurantes")
      .where("restaurantes.id", id)
      .join(
        "horario_de_funcionamento",
        "restaurantes.horarios",
        "horario_de_funcionamento.id"
      )
      .select(
        "restaurantes.id",
        "restaurantes.email",
        "restaurantes.nome",
        "restaurantes.foto",
        "restaurantes.endereco",
        "horario_de_funcionamento.seg as h_seg",
        "horario_de_funcionamento.ter as h_ter",
        "horario_de_funcionamento.qua as h_qua",
        "horario_de_funcionamento.qui as h_qui",
        "horario_de_funcionamento.sex as h_sex",
        "horario_de_funcionamento.sab as h_sab",
        "horario_de_funcionamento.dom as h_dom"
      )
      .then(function (rows) {
        if (!rows[0]) {
          return rows[0];
        }
        rows[0].horarios = {};
        for (const [key, value] of Object.entries(rows[0])) {
          if (key.split("_")[0] === "h") {
            const nome = key.split("_")[1];
            rows[0].horarios[nome] = value;
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

const update = async (req, res) => {};

const del = async (req, res) => {};

module.exports = {
  create,
  data,
  update,
  del,
  list,
};
