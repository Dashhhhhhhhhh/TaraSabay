const express = require("express");
const router = express.Router();

const { createDriverProfileController } = require("./ride_offers.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  createDriverProfileController,
);

module.exports = router;
