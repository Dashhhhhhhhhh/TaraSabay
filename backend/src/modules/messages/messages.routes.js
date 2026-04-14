const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const {
  createMessageController,
  findMessageByIdController,
  markMessageAsReadController,
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

router.patch(
  "/:message_id/read",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  markMessageAsReadController,
);
module.exports = router;
