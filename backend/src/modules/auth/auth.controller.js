const {
  registerAuthService,
  loginAuthService,
  getMeService,
} = require("./auth.service");

async function regiterAuthController(req, res) {
  try {
    const result = await registerAuthService(req.body);

    if (!result.success) {
      const statusMap = {
        MISSING_REQUIRED_FIELDS: 400,
        INVALID_CONTACT_NUMBER: 400,
        DUPLICATE_EMAIL: 409,
        INVALID_ROLE: 400,
        DEFAULT_ROLE_NOT_FOUND: 404,
        INVALID_PASSWORD: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}

async function loginAuthController(req, res) {
  try {
    const result = await loginAuthService(req.body);

    if (!result.success) {
      const statusMap = {
        VALIDATION_ERROR: 400,
        INVALID_CREDENTIALS: 401,
        ACCOUNT_INACTIVE: 403,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

async function getMeController(req, res) {
  try {
    const result = await getMeService(req.user.user_id);

    if (!result.success) {
      const statusMap = {
        USER_NOT_FOUND: 404,
        ACCOUNT_INACTIVE: 403,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error Fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

module.exports = {
  regiterAuthController,
  loginAuthController,
  getMeController,
};
