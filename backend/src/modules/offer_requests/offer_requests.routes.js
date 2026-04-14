const express = require("express");
const router = express.Router();

const {
  createOfferRequestController,
  getOfferRequestByIdController,
  cancelOfferRequestController,
} = require("./offer_requests.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  createOfferRequestController,
);

router.get(
  "/:offer_request_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  getOfferRequestByIdController,
);

router.patch(
  "/:offer_request_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  cancelOfferRequestController,
);

module.exports = router;
