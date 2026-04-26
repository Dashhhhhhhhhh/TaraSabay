const express = require("express");
const router = express.Router();

const {
  createRequestResponseController,
  getRequestResponseByIdController,
  getRequestResponsesByRideRequestIdController,
  acceptRequestResponseController,
  rejectRequestResponseController,
  cancelRequestResponseController,
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

router.get(
  "/:ride_request_id/request-responses",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  getRequestResponsesByRideRequestIdController,
);

router.patch(
  "/:request_response_id/accept",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  acceptRequestResponseController,
);

router.patch(
  "/:request_response_id/reject",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger"]),
  rejectRequestResponseController,
);

router.patch(
  "/:request_response_id/cancel",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  cancelRequestResponseController,
);
module.exports = router;
