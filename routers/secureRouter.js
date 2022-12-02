const express = require("express");
const secureRouter = express.Router();

const SecureController = require("../controllers/SecureController");

console.log("secure router")
secureRouter.get("/secure-area", SecureController.Index);

module.exports = secureRouter;
