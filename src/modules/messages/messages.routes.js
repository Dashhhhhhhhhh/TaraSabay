const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const {
  createMessageController,
  findMessageByIdController,
} = require("./messages.controller");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  createMessageController,
);

router.get(
  "/:message_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  findMessageByIdController,
);

module.exports = router;
