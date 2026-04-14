const {
  createRideRequestService,
  getAllRideRequestsService,
  getRideRequestByIdService,
  updateRideRequestService,
  cancelRideRequestService,
} = require("./ride_requests.service");

async function createRideRequestController(req, res) {
  try {
    const rider_user_id = req.user.user_id;
    console.log(rider_user_id);
    console.log(req.body);
    const result = await createRideRequestService(rider_user_id, req.body);
    if (!result.success) {
      const statusMap = {
        INVALID_USER_ID: 400,
        MISSING_REQUIRED_FIELDS: 400,
        INVALID_PICKUP_LOCATION: 400,
        INVALID_DROPOFF_LOCATION: 400,
        SAME_PICKUP_AND_DROPOFF: 400,
        INVALID_DEPARTURE_TIME: 400,
        INVALID_REQUESTED_SEATS: 400,
        INVALID_NOTES: 400,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating ride request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during creating ride request",
    });
  }
}

async function getAllRideRequestsController(req, res) {
  try {
    const result = await getAllRideRequestsService();

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching ride requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching ride requests",
    });
  }
}

async function getRideRequestByIdController(req, res) {
  try {
    const { ride_request_id } = req.params;
    const result = await getRideRequestByIdService(ride_request_id);
    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_REQUEST_ID: 400,
        INVALID_RIDE_REQUEST_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching ride request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetching ride request",
    });
  }
}

async function updateRideRequestController(req, res) {
  try {
    const { ride_request_id } = req.params;
    const rider_user_id = req.user.user_id;
    const { role } = req.user;
    const updatedData = req.body;

    const result = await updateRideRequestService(
      ride_request_id,
      rider_user_id,
      updatedData,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_REQUEST_ID: 400,
        INVALID_RIDE_REQUEST_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        MISSING_ROLE: 400,
        INVALID_UPDATE_PAYLOAD: 400,
        NO_VALID_FIELDS_TO_UPDATE: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 403,
        RIDE_REQUEST_NOT_EDITABLE: 409,
        INVALID_PICKUP_LOCATION: 400,
        INVALID_DROPOFF_LOCATION: 400,
        SAME_PICKUP_AND_DROPOFF: 400,
        INVALID_DEPARTURE_TIME: 400,
        INVALID_REQUESTED_SEATS: 400,
        INVALID_NOTES: 400,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating ride request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during updating ride request",
    });
  }
}

async function cancelRideRequestController(req, res) {
  try {
    const { ride_request_id } = req.params;
    const rider_user_id = req.user.user_id;
    const { role } = req.user;

    const result = await cancelRideRequestService(
      ride_request_id,
      rider_user_id,
      role,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_RIDE_REQUEST_ID: 400,
        INVALID_RIDE_REQUEST_ID: 400,
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        RIDE_REQUEST_NOT_FOUND: 404,
        FORBIDDEN_ACCESS: 404,
        RIDE_REQUEST_ALREADY_CANCELLED: 409,
        RIDE_REQUEST_NOT_CANCELLABLE: 409,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error cancelling ride request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during cancelling ride request",
    });
  }
}

module.exports = {
  createRideRequestController,
  getAllRideRequestsController,
  getRideRequestByIdController,
  updateRideRequestController,
  cancelRideRequestController,
};
