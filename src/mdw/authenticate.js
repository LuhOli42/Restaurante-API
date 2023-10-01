const knex = require("../db/db");
const jwt = require("jsonwebtoken");
const senhaApi = process.env.SENHA_HASH;

const restaurant = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const tokenVerify = await jwt.verify(token, senhaApi);

    const userStillExist = await knex("restaurantes")
      .where({
        id: tokenVerify.id,
      })
      .first();

    if (!userStillExist) {
      return res.status(404).json({ message: "Erro no token" });
    }
    const ojbRestaurant = {
      id: tokenVerify.id,
      email: tokenVerify.email,
      nome: tokenVerify.nome,
      horarioTabela: tokenVerify.horarioTabela,
    };

    req.restaurant = ojbRestaurant;
    next();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  restaurant,
};
