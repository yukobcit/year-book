const ProfileController = require("../controllers/ProfileController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const profilesRouter = express.Router();

const dataPath = path.join(__dirname, "../data/");

profilesRouter.get("/", ProfileController.Index);

profilesRouter.get("/edit", ProfileController.Create);
profilesRouter.post("/edit", ProfileController.CreateProfile);

profilesRouter.get("/edit/:id", ProfileController.Edit);
profilesRouter.post("/edit/:id", ProfileController.EditProfile);

profilesRouter.get("/:id", ProfileController.Detail);
profilesRouter.get("/:id/delete", ProfileController.DeleteProfileById);

module.exports = profilesRouter;

