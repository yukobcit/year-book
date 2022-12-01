const express = require("express");
const secureRouter = express.Router();

const SecureController = require("../controllers/SecureController");

secureRouter.get("/secure-area", SecureController.Index);

module.exports = secureRouter;
