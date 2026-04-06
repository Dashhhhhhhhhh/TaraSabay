const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const {
  createRideRequestController,
  getAllRideRequestsController,
  getRideRequestByIdController,
  updateRideRequestController,
  cancelRideRequestController,
} = require("./ride_requests.controller");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  createRideRequestController,
);

router.get(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  getAllRideRequestsController,
);

router.get(
  "/:ride_request_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  getRideRequestByIdController,
);

router.patch(
  "/:ride_request_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  updateRideRequestController,
);

router.patch(
  "/:ride_request_id/cancel",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  cancelRideRequestController,
);

module.exports = router;
