const express = require("express");
const router = express.Router();

const {
  createDriverProfileController,
  findDriverProfileWithUserInfoByUserIdController,
  updateDriverProfileController,
} = require("./driver.controller");

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  createDriverProfileController,
);

router.get(
  "/:user_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  findDriverProfileWithUserInfoByUserIdController,
);

router.patch(
  "/:driver_profile_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Driver"]),
  updateDriverProfileController,
);
module.exports = router;
