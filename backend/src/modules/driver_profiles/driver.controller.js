const {
  createDriverProfileService,
  findDriverProfileWithUserInfoByUserIdService,
  updateDriverProfileService,
  getMyDriverProfileService,
} = require("./driver.service");

async function createDriverProfileController(req, res) {
  try {
    const result = await createDriverProfileService(req.body);

    if (!result.succcess) {
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

async function findDriverProfileWithUserInfoByUserIdController(req, res) {
  try {
    const result = await findDriverProfileWithUserInfoByUserIdService(
      req.user.user_id,
    );

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
        NO_DRIVER_PROFILE: 400,
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

module.exports = {
  createDriverProfileController,
  findDriverProfileWithUserInfoByUserIdController,
  updateDriverProfileController,
  getMyDriverProfileController,
};
