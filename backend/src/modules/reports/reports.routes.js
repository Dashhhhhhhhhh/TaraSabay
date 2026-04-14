const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

const {
  createReportController,
  findReportByIdController,
  getAllReportsForAdminController,
} = require("./reports.controller");

router.post(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  createReportController,
);

router.get(
  "/:report_id",
  authenticateJWT,
  authorizeRoles(["Admin", "Passenger", "Driver"]),
  findReportByIdController,
);

router.get(
  "/",
  authenticateJWT,
  authorizeRoles(["Admin"]),
  getAllReportsForAdminController,
);

module.exports = router;
