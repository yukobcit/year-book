const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/logout", UserController.Logout);

module.exports = userRouter;
