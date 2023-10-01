const express = require("express");
const login = require("./crtl/login");
const restaurant = require("./crtl/restaurant");
const product = require("./crtl/product");
const auth = require("./mdw/authenticate");

const routes = express();

//all ascess

//restaurant related
routes.post("/createRestaurant", restaurant.create);
routes.get("/listRestaurants", restaurant.list);
routes.get("/dataRestaurant/:id", restaurant.data);
routes.post("/loginRestaurant", login.restaurant);

//product related
routes.get("/listAllProducts", product.listAllProducts);
routes.get("/listRestaurantProduct", product.listRestaurant);
routes.get("dataProduct/:id", product.data);

//user related

//routes of restaurant login
routes.put("/updateRestaurant", auth.restaurant, restaurant.update);
routes.delete("/deleteRestaurante", auth.restaurant, restaurant.del);

//restaurant product manager
routes.post("/createProduct", auth.restaurant, product.create);
routes.put("/updateProduct/:idProduto", auth.restaurant, product.update);
routes.delete("/deleteProduto/:id", auth.restaurant, product.del);

//routes of user login

module.exports = routes;
