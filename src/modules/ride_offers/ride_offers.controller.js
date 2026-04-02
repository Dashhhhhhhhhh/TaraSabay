const {
  createRideOfferService,
  findRideOfferWithDriverInfoByiDService,
  getAllRideOffersService,
  updateRideOfferService,
  cancelRideOfferService,
} = require("./ride_offers.service");

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

async function findRideOfferWithDriverInfoByiDController(req, res) {
  try {
    const { ride_offer_id } = req.params;
    const result = await findRideOfferWithDriverInfoByiDService(ride_offer_id);

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RODE_OFFER_ID: 404,
        RIDE_OFFER_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching ride offers with driver info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

async function getAllRideOffersController(req, res) {
  try {
    const result = await getAllRideOffersService();

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all offers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during getting all offers",
    });
  }
}

async function updateRideOfferController(req, res) {
  try {
    const { ride_offer_id } = req.params;
    const { updatedData } = req.body;
    const result = await updateRideOfferService(ride_offer_id, updatedData);

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RODE_OFFER_ID: 404,
        NO_UPDATE_DATA: 400,
        INVALID_PICKUP_LOCATION: 400,
        INVALID_DROPOFF_LOCATION: 400,
        SAME_PICKUP_AND_DROPOFF: 400,
        INVALID_DEPARTURE_TIME: 400,
        INVALID_NOTES: 400,
        MISSING_UPDATE_FIELDS: 404,
        RIDE_OFFER_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating ride offers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during updating ride offers",
    });
  }
}

async function cancelRideOfferController(req, res) {
  try {
    const rideOfferId = req.params.ride_offer_id;
    const result = await cancelRideOfferService(rideOfferId);

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RIDE_OFFER_ID: 400,
        RIDE_OFFER_NOT_FOUND: 404,
        RIDE_OFFER_ALREADY_CANCELLED: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error cancelling offers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during cancelling offer",
    });
  }
}

module.exports = {
  createDriverProfileController,
  findRideOfferWithDriverInfoByiDController,
  getAllRideOffersController,
  updateRideOfferController,
  cancelRideOfferController,
};
