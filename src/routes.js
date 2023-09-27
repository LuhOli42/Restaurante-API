const express = require("express");

const routes = express();

routes.get("/listarRestaurantes");
routes.get("/dadosRestaurante/:id");
routes.get("listarProdutosRestaurante");

routes.post("/cadastrarRestaurante");

//routes.use(auth)

routes.post("/cadastrarProduto");
routes.put("/atualizarProduto/:idProduto");
routes.put("/atualizarDadosRestaurante");

routes.delete("/deletarRestaurante/:id");
routes.delete("/deletarProduto/:id");

module.exports = routes;
