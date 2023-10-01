const bcrypt = require("bcrypt");
const knex = require("../db/db");
const jwt = require("jsonwebtoken");
const senhaApi = process.env.SENHA_HASH;

const restaurant = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: "Digite o email ou a senha" });
  }
  try {
    const existeEmail = await knex("restaurantes").where({ email }).first();

    if (!existeEmail) {
      return res.status(404).json({ message: "Email ou senha incorretos" });
    }

    const senhaCorreta = await bcrypt.compare(senha, existeEmail.senha);

    if (!senhaCorreta) {
      return res.status(404).json({ message: "Email ou senha incorretos" });
    }

    const restaurante = {
      id: existeEmail.id,
      email: existeEmail.email,
      nome: existeEmail.nome,
    };

    const token = await jwt.sign(restaurante, senhaApi, { expiresIn: "8h" });
    const returnObj = { restaurante, token };

    return res.status(200).json(returnObj);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  restaurant,
};
