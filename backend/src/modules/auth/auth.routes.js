const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const {
  regiterAuthController,
  loginAuthController,
  getMeController,
} = require("./auth.controller");

const {
  getMyOfferRequestController,
} = require("./../offer_requests/offer_requests.controller");

const {
  getMyRequestResponseController,
} = require("./../response_request/response_request.controller");

const {
  getMyMessagesController,
} = require("./../messages/messages.controller");

const { getMyReportsController } = require("./../reports/reports.controller");

const {
  getMyDriverProfileController,
} = require("./../driver_profiles/driver.controller");

router.post("/register", regiterAuthController);

router.post("/login", loginAuthController);

router.get("/me", authenticateJWT, getMeController);

router.get(
  "/me/offer-requests",
  authenticateJWT,
  authorizeRoles(["Passenger"]),
  getMyOfferRequestController,
);

router.get(
  "/me/request-responses",
  authenticateJWT,
  authorizeRoles(["Driver"]),
  getMyRequestResponseController,
);

router.get(
  "/me/messages",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  getMyMessagesController,
);

router.get(
  "/me/reports",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  getMyReportsController,
);

router.get(
  "/me/driver-profile",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  getMyDriverProfileController,
);

module.exports = router;
