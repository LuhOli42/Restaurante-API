const express = require("express");
const { login } = require("./crtl/login");
const restaurant = require("./crtl/restaurant");
const product = require("./crtl/product");

const routes = express();

routes.get("/listrestaurant", restaurant.list);
routes.get("/listAllProducts", product.listAllProducts);
routes.get("/dataRestaurant/:id", restaurant.data);
routes.get("/listRestaurantProduct", product.listRestaurant);
routes.get("dataProduct/:id", product.data);

routes.post("/createRestaurant", restaurant.create);
routes.post("/login", login);

//routes.use(auth)

routes.post("/createProduct", product.create);
routes.put("/updateProduct/:idProduto", product.update);
routes.put("/updateRestaurant", restaurant.update);

routes.delete("/deleteRestaurante/:id", restaurant.del);
routes.delete("/deleteProduto/:id", product.del);

module.exports = routes;
