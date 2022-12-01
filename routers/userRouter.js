const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

module.exports = userRouter;
