const express = require("express");
const indexRouter = express.Router();

const IndexController = require("../controllers/IndexController");

indexRouter.get("/", IndexController.Index);

indexRouter.get("/register", IndexController.Register);
indexRouter.post("/register", IndexController.RegisterUser);

indexRouter.get("/login", IndexController.Login);
indexRouter.post("/login", IndexController.LoginUser);

indexRouter.get("/logout", IndexController.Logout);


module.exports = indexRouter;
