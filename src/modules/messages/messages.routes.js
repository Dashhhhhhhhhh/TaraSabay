const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const { createMessageController } = require("./messages.controller");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  createMessageController,
);

module.exports = router;
