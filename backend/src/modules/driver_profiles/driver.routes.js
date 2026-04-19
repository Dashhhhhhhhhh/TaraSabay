const express = require("express");
const router = express.Router();

const {
  createDriverProfileController,
  getMyDriverProfileController,
  getDriverProfileByUserIdController,
  updateDriverProfileController,
} = require("./driver.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  createDriverProfileController,
);

router.get(
  "/:user_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  getDriverProfileByUserIdController,
);

router.patch(
  "/:driver_profile_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver", "Passenger"]),
  updateDriverProfileController,
);
module.exports = router;
