const { createOfferRequestService } = require("./offer_requests.service");

async function createOfferRequestController(req, res) {
  try {
    const passenger_user_id = req.user.user_id;
    const result = await createOfferRequestService({
      ...req.body,
      passenger_user_id,
    });
    if (!result.success) {
      const statusMap = {
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

module.exports = { createOfferRequestController };
