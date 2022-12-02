const express = require("express");
const userRouter = express.Router();

const UserController = require("../controllers/UserController");

console.log("user router")

userRouter.get("/", UserController.Index);

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/login", UserController.Login);
userRouter.post("/login", UserController.LoginUser);

userRouter.get("/logout", UserController.Logout);
userRouter.get("/profile", UserController.Profile);

userRouter.get("/edit/:id", UserController.Edit);
userRouter.post("/edit/:id",UserController.EditStudent);


userRouter.get("/:id", UserController.Detail);

module.exports = userRouter;
