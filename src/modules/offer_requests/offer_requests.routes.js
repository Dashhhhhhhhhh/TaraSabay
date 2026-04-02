const express = require("express");
const router = express.Router();

const { createOfferRequestController } = require("./offer_requests.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  createOfferRequestController,
);

module.exports = router;
