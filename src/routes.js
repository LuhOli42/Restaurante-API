const express = require("express");
const { login } = require("./crtl/login");
const restaurant = require("./crtl/restaurant");
const product = require("./crtl/product");

const routes = express();

routes.get("/listarRestaurantes", restaurant.listar);
routes.get("listarTodosOsProdutos", product.listarTodos);
routes.get("/dadosRestaurante/:id", restaurant.dados);
routes.get("listarProdutosRestaurante", product.listar);
routes.get("dadosDoProdutoRestaurante/:id", product.dados);

routes.post("/cadastrarRestaurante", restaurant.cadastrar);
routes.post("/login", login);

//routes.use(auth)

routes.post("/cadastrarProduto", product.cadastrar);
routes.put("/atualizarProduto/:idProduto", product.atualizar);
routes.put("/atualizarDadosRestaurante", restaurant.atualizar);

routes.delete("/deletarRestaurante/:id", restaurant.deletar);
routes.delete("/deletarProduto/:id", product.deletar);

module.exports = routes;
