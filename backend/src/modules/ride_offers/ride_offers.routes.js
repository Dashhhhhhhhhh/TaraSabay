const express = require("express");
const router = express.Router();

const {
  createRideOfferController,
  findRideOfferWithDriverInfoByiDController,
  getAllRideOffersController,
  updateRideOfferController,
  cancelRideOfferController,
} = require("./ride_offers.controller");

const {
  getOfferRequestsByOfferController,
} = require("./../offer_requests/offer_requests.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  createRideOfferController,
);

router.get(
  "/:ride_offer_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  findRideOfferWithDriverInfoByiDController,
);

router.get(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  getAllRideOffersController,
);

router.patch(
  "/:ride_offer_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  updateRideOfferController,
);

router.patch(
  "/:ride_offer_id/cancel",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  cancelRideOfferController,
);

router.get(
  "/:ride_offer_id/offer-requests",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  getOfferRequestsByOfferController,
);

module.exports = router;
