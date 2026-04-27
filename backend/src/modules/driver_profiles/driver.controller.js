const {
  createDriverProfileService,
  getDriverProfileByUserIdService,
  updateDriverProfileService,
  getMyDriverProfileService,
} = require("./driver.service");

async function createDriverProfileController(req, res) {
  try {
    const user_id = req.user.user_id;
    const { vehicle_type, seat_capacity } = req.body;

    const payload = { user_id, vehicle_type, seat_capacity };
    const result = await createDriverProfileService(payload);

    if (!result.success) {
      const statusMap = {
        MISSING_REQUIRED_FIELDS: 400,
        INVALID_USER_ID: 400,
        USER_NOT_FOUND: 404,
        DRIVER_PROFILE_ALREADY_EXISTS: 409,
        INVALID_VEHICLE_TYPE: 400,
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

async function getDriverProfileByUserIdController(req, res) {
  try {
    const result = await getDriverProfileByUserIdService(req.user.user_id);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 400,
        DRIVER_PROFILE_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error creating driver profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

async function updateDriverProfileController(req, res) {
  try {
    const updatedData = req.body;
    const { driver_profile_id } = req.params;

    const result = await updateDriverProfileService(
      driver_profile_id,
      updatedData,
    );

    if (!result.success) {
      const statusMap = {
        MISSING_DRIVER_PROFILE_ID: 400,
        INVALID_DRIVER_PROFILE_ID: 400,
        DRIVER_PROFILE_NOT_FOUND: 404,
        INVALID_VEHICLE_TYPE: 400,
        INVALID_SEAT_CAPACITY: 400,
        MISSING_UPDATE_FIELDS: 400,
        DRIVER_PROFILE_UPDATED: 200,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating driver profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
}

async function getMyDriverProfileController(req, res) {
  try {
    const user_id = req.user.user_id;

    const result = await getMyDriverProfileService(user_id);

    if (!result.success) {
      const statusMap = {
        MISSING_USER_ID: 400,
        INVALID_USER_ID: 404,
        USER_NOT_FOUND: 404,
        DRIVER_PROFILE_NOT_FOUND: 404,
      };
      const status = statusMap[result.code] || 500;
      return res.status(status).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during fetch my driver profile",
    });
  }
}

module.exports = {
  createDriverProfileController,
  getDriverProfileByUserIdController,
  updateDriverProfileController,
  getMyDriverProfileController,
};
