const {
  createRequestResponseService,
  getRequestResponseByIdservice,
  getRequestResponsesByRideRequestIdService,
  getMyRequestResponseService,
  acceptRequestResponseService,
  rejectRequestResponseService,
  cancelRequestResponseService,
} = require("./response_request.service");

async function createRequestResponseController(req, res) {
  try {
    const { ride_request_id, message } = req.body;
    const user_id = req.user.user_id;

    const requestData = {
      ride_request_id,
      driver_user_id: user_id,
      message,
    };
    const result = await createRequestResponseService(requestData);

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_REQUEST: 400,
        MISSING_USER_ID: 400,
        INVALID_RIDE_REQUEST_ID: 400,
        INVALID_USER_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
        RIDE_REQUEST_NOT_OPEN: 409,
        SELF_RESPONSE_NOT_ALLOWED: 403,
        INVALID_MESSAGE: 400,
        DRIVER_PROFILE_REQUIRED: 400,
        DUPLICATE_PENDING_RESPONSE: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating request response",
    });
  }
}

async function getRequestResponseByIdController(req, res) {
  try {
    const { request_response_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user;

    const result = await getRequestResponseByIdservice(
      request_response_id,
      user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_REQUEST_RESPONSE_ID: 400,
        INVALID_REQUEST_RESPONSE_ID: 400,
        REQUEST_RESPONSE_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching request response",
    });
  }
}

async function getRequestResponsesByRideRequestIdController(req, res) {
  try {
    const { ride_request_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user;

    const result = await getRequestResponsesByRideRequestIdService(
      ride_request_id,
      user_id,
      role,
    );
    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_REQUEST_ID: 400,
        INVALID_RIDE_REQUEST_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching request response",
    });
  }
}

async function getMyRequestResponseController(req, res) {
  try {
    const driver_user_id = req.user.user_id;

    const result = await getMyRequestResponseService(driver_user_id);
    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching request response",
    });
  }
}

async function acceptRequestResponseController(req, res) {
  try {
    const { request_response_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user;

    const result = await acceptRequestResponseService(
      request_response_id,
      user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_REQUEST_RESPONSE_ID: 400,
        INVALID_REQUEST_RESPONSE_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,
        REQUEST_RESPONSE_NOT_FOUND: 404,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        REQUEST_RESPONSE_ALREADY_FINAL: 409,
        RIDE_REQUEST_NOT_OPEN: 409,
        INTERNAL_ERROR: 500,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching request response",
    });
  }
}

async function rejectRequestResponseController(req, res) {
  try {
    const { request_response_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user;

    const result = await rejectRequestResponseService(
      request_response_id,
      user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_REQUEST_RESPONSE_ID: 400,
        INVALID_REQUEST_RESPONSE_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,
        REQUEST_RESPONSE_NOT_FOUND: 404,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        REQUEST_ALREADY_FINAL: 409,
        REQUEST_NOT_OPEN: 409,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching cancel response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching cancel response",
    });
  }
}

async function cancelRequestResponseController(req, res) {
  try {
    const { request_response_id } = req.params;
    const user_id = req.user.user_id;
    const role = req.user;

    const result = await cancelRequestResponseService(
      request_response_id,
      user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_REQUEST_RESPONSE_ID: 400,
        INVALID_REQUEST_RESPONSE_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,
        REQUEST_RESPONSE_NOT_FOUND: 404,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        REQUEST_RESPONSE_ALREADY_FINAL: 409,
        RIDE_REQUEST_NOT_OPEN: 409,
        INTERNAL_ERROR: 500,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching request response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching request response",
    });
  }
}

module.exports = {
  createRequestResponseController,
  getRequestResponseByIdController,
  getRequestResponsesByRideRequestIdController,
  getMyRequestResponseController,
  acceptRequestResponseController,
  rejectRequestResponseController,
  cancelRequestResponseController,
};
