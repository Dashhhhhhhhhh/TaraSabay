const {
  createOfferRequestService,
  getOfferRequestByIdService,
  getOfferRequestsByOfferService,
  getMyOfferRequestService,
  cancelOfferRequestService,
  acceptOfferRequestService,
  rejectOfferRequestService,
} = require("./offer_requests.service");

async function createOfferRequestController(req, res) {
  try {
    const passenger_user_id = req.user.user_id;
    const result = await createOfferRequestService({
      ...req.body,
      passenger_user_id,
    });
    if (!result.success) {
      const statusMap = {
        EXCEEDS_AVAILABLE_SEATS: 400,
        MISSING_REQUIRED_FIELDS: 400,
        INVALID_USER_ID: 400,
        INVALID_SEAT_CAPACITY: 400,
        INVALID_RIDE_OFFER_ID: 400,
        INVALID_REQUESTED_SEATS: 400,
        INVALID_MESSAGE: 400,
        RIDE_OFFER_NOT_FOUND: 404,
        RIDE_OFFER_NOT_OPEN: 409,
        CANNOT_REQUEST_OWN_RIDE_OFFER: 409,
        REQUESTED_SEATS_EXCEED_AVAILABLE_SEATS: 409,
        DUPLICATE_PENDING_REQUEST: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating offer request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error offer request.",
    });
  }
}

async function getOfferRequestByIdController(req, res) {
  try {
    const { offer_request_id } = req.params;
    const { user_id } = req.user;
    const result = await getOfferRequestByIdService(offer_request_id, user_id);
    if (!result.success) {
      const statusMap = {
        MISSING_OFFER_REQUEST_ID: 400,
        INVALID_OFFER_REQUEST_ID: 400,
        OFFER_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching offer request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching offer request.",
    });
  }
}

async function getOfferRequestsByOfferController(req, res) {
  try {
    const { ride_offer_id } = req.params;
    const user_id = req.user.user_id;
    const { role } = req.user;

    const result = await getOfferRequestsByOfferService(
      ride_offer_id,
      user_id,
      role,
    );
    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RIDE_OFFER_ID: 400,
        RIDE_OFFER_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching offer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching offer requests.",
    });
  }
}

async function getMyOfferRequestController(req, res) {
  try {
    const passenger_user_id = req.user.user_id;
    const { role } = req.user;

    const result = await getMyOfferRequestService(passenger_user_id, role);
    if (!result.success) {
      const statusMap = {
        MISSING_PASSENGER_USER_ID: 400,
        INVALID_PASSENGER_USER_ID: 400,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching offer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching offer requests.",
    });
  }
}

async function cancelOfferRequestController(req, res) {
  try {
    const { offer_request_id } = req.params;
    const passenger_user_id = req.user.user_id;
    const { role } = req.user;
    const result = await cancelOfferRequestService(
      offer_request_id,
      passenger_user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_OFFER_REQUEST_ID: 400,
        INVALID_OFFER_REQUEST_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        OFFER_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        REQUEST_ALREADY_FINAL: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error cancelling offer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error cancelling offer requests.",
    });
  }
}

async function acceptOfferRequestController(req, res) {
  try {
    const { offer_request_id } = req.params;
    const user_id = req.user.user_id;
    const { role } = req.user;
    const result = await acceptOfferRequestService(
      offer_request_id,
      user_id,
      role,
    );
    if (!result.success) {
      const statusMap = {
        MISSING_OFFER_REQUEST_ID: 400,
        INVALID_OFFER_REQUEST_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,

        OFFER_REQUEST_NOT_FOUND: 404,
        RIDE_OFFER_NOT_FOUND: 404,

        FORBIDDEN_ACCESS: 403,

        REQUEST_ALREADY_FINAL: 409,
        RIDE_OFFER_NOT_OPEN: 409,
        NOT_ENOUGH_AVAILABLE_SEATS: 409,
      };

      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error accepting offer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error accepting offer requests.",
    });
  }
}

async function rejectOfferRequestController(req, res) {
  try {
    const { offer_request_id } = req.params;
    const user_id = req.user.user_id;
    const { role } = req.user;
    const result = await rejectOfferRequestService(
      offer_request_id,
      user_id,
      role,
    );
    if (!result.success) {
      const statusMap = {
        MISSING_OFFER_REQUEST_ID: 400,
        INVALID_OFFER_REQUEST_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,

        OFFER_REQUEST_NOT_FOUND: 404,
        RIDE_OFFER_NOT_FOUND: 404,

        FORBIDDEN_ACCESS: 403,

        REQUEST_ALREADY_FINAL: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error rejecting offer requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error rejecting offer requests.",
    });
  }
}

module.exports = {
  createOfferRequestController,
  getOfferRequestByIdController,
  getOfferRequestsByOfferController,
  getMyOfferRequestController,
  cancelOfferRequestController,
  acceptOfferRequestController,
  rejectOfferRequestController,
};
