const express = require("express");
const router = express.Router();

const { authenticateJWT } = require("./../../middlewares/auth.middleware");
const { authorizeRoles } = require("./../../middlewares/auhtorizeRoles");

module.exports = router;
