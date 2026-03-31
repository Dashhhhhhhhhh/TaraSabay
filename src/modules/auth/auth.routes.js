const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const {
  regiterAuthController,
  loginAuthController,
  getMeController,
} = require("./auth.controller");

router.post("/register", regiterAuthController);

router.post("/login", loginAuthController);

router.get("/me", authenticateJWT, getMeController);

module.exports = router;
