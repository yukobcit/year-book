const express = require("express");
const yearBookRouter = express.Router();

const YearBookController = require("../controllers/YearBookController");

yearBookRouter.get("/", YearBookController.Index);
yearBookRouter.get("/profile", YearBookController.Profile);

yearBookRouter.get("/edit/:id", YearBookController.Edit);
yearBookRouter.post("/edit/:id",YearBookController.EditStudent);

yearBookRouter.post("/comment/:id",YearBookController.CommentStudent);
yearBookRouter.get("/delete/:id", YearBookController.DeleteStudentById);

yearBookRouter.get("/:id", YearBookController.Detail);


module.exports = yearBookRouter;
