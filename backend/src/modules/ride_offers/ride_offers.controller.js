const {
  createRideOfferService,
  findRideOfferWithDriverInfoByiDService,
  getAllRideOffersService,
  updateRideOfferService,
  cancelRideOfferService,
} = require("./ride_offers.service");

async function createRideOfferController(req, res) {
  try {
    const user_id = req.user.user_id;

    const { pickup_location, dropoff_location, departure_time, notes } =
      req.body;

    const payload = {
      user_id,
      pickup_location,
      dropoff_location,
      departure_time,
      notes,
    };
    const result = await createRideOfferService(payload);

    if (!result.success) {
      const statusMap = {
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
    console.error("Error creating ride offer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating ride offer",
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
    const updatedData = req.body;
    const user_id = req.user.user_id;

    const { role } = req.user;
    const result = await updateRideOfferService(
      ride_offer_id,
      user_id,
      role,
      updatedData,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RIDE_OFFER_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,
        INVALID_UPDATE_PAYLOAD: 400,
        NO_VALID_FIELDS_TO_UPDATE: 400,
        RIDE_OFFER_NOT_EDITABLE: 409,
        INVALID_PICKUP_LOCATION: 400,
        INVALID_DROPOFF_LOCATION: 400,
        INVALID_DEPARTURE_TIME: 400,
        SAME_PICKUP_AND_DROPOFF: 400,
        FORBIDDEN_ACCESS: 403,
        RIDE_OFFER_NOT_FOUND: 404,
        RIDE_OFFER_NOT_CANCELLABLE: 409,
        RIDE_OFFER_ALREADY_CANCELLED: 409,
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
    const user_id = req.user.user_id;
    const { role } = req.user;
    const result = await cancelRideOfferService(rideOfferId, user_id, role);

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_OFFER_ID: 400,
        INVALID_RIDE_OFFER_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        FORBIDDEN_ACCESS: 403,
        RIDE_OFFER_NOT_FOUND: 404,
        RIDE_OFFER_NOT_CANCELLABLE: 409,
        RIDE_OFFER_ALREADY_CANCELLED: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error cancelling ride offer:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while cancelling ride offer.",
    });
  }
}

module.exports = {
  createRideOfferController,
  findRideOfferWithDriverInfoByiDController,
  getAllRideOffersController,
  updateRideOfferController,
  cancelRideOfferController,
};
