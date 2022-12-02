const express = require("express");
const indexRouter = express.Router();

const IndexController = require("../controllers/IndexController");

console.log("index router")

indexRouter.get("/", IndexController.Index);
indexRouter.get("/about", IndexController.About);
indexRouter.get("/contact", IndexController.Contact);

module.exports = indexRouter;
