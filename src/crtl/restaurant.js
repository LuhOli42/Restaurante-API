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

const list = async (req, res) => {};

const data = async (req, res) => {};

const update = async (req, res) => {};

const del = async (req, res) => {};

module.exports = {
  create,
  data,
  update,
  del,
  list,
};
