const { createRideOfferService } = require("./ride_offers.service");

async function createDriverProfileController(req, res) {
  try {
    const result = await createRideOfferService(req.body);

    if (!result.success) {
      const statusMap = {
        RIDE_OFFER_CREATED: 201,
        MISSING_REQUIRED_FIELDS: 400,
        INVALID_USER_ID: 400,
        INVALID_PICKUP_LOCATION: 400,
        INVALID_DROPOFF_LOCATION: 400,
        SAME_PICKUP_AND_DROPOFF: 400,
        INVALID_DEPARTURE_TIME: 400,
        DEPARTURE_TIME_IN_PAST: 400,
        INVALID_NOTES: 400,
        DRIVER_PROFILE_NOT_FOUND: 404,
        INVALID_DRIVER_PROFILE: 400,
        INVALID_SEAT_CAPACITY: 400,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating driver profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

module.exports = { createDriverProfileController };
