const express = require("express");
const router = express.Router();

const {
  createRequestResponseController,
  getRequestResponseByIdController,
} = require("./response_request.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  createRequestResponseController,
);

router.get(
  "/:request_response_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  getRequestResponseByIdController,
);

module.exports = router;
