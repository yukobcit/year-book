const express = require("express");
const yearBookRouter = express.Router();

const YearBookController = require("../controllers/YearBookController");

yearBookRouter.get("/", YearBookController.Index);
yearBookRouter.get("/detail", YearBookController.Detail);

yearBookRouter.get("/edit/:id", YearBookController.Edit);
yearBookRouter.post("/edit/:id",YearBookController.EditStudent);

yearBookRouter.post("/comment/:id",YearBookController.CommentStudent);
yearBookRouter.get("/comment/:id",YearBookController.Detail);
yearBookRouter.get("/delete/:id", YearBookController.DeleteStudentById);

yearBookRouter.get("/:id", YearBookController.Detail);

module.exports = yearBookRouter;
