const { isValidUUID } = require("./../../utils/security");

const { cleanName } = require("../../utils/helper.js");

const {
  findDriverProfileByUserId,
  findUserById,
  createDriverProfile,
  getDriverProfileByUserId,
  findDriverProfileById,
  updateDriverProfile,
  getMyDriverProfile,
} = require("./driver.repository");

async function createDriverProfileService(driverData) {
  const { user_id, vehicle_type, seat_capacity } = driverData;

  console.log("Service called with payload:", {
    user_id,
    vehicle_type,
    seat_capacity,
  });

  console.log("Validating user_id:", `"${user_id}"`, typeof user_id);

  const cleanVehicleType = cleanName(vehicle_type);

  if (!user_id || !vehicle_type || !seat_capacity) {
    return {
      success: false,
      code: "MISSING_REQUIRED_FIELDS",
      message: "All required fields must be provided.",
    };
  }

  if (!isValidUUID(user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid User ID.",
    };
  }

  const existingUser = await findUserById(user_id);
  if (!existingUser) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "No user found with the provided ID.",
    };
  }

  const existingUserProfile = await findDriverProfileByUserId(user_id);
  if (existingUserProfile) {
    return {
      success: false,
      code: "DRIVER_PROFILE_ALREADY_EXISTS",
      message: "Driver profile already exists for this user.",
    };
  }

  const allowedVehicleType = ["sedan", "van", "suv", "motorcycle"];
  if (!allowedVehicleType.includes(cleanVehicleType)) {
    return {
      success: false,
      code: "INVALID_VEHICLE_TYPE",
      message: "Vehicle type must be one of: sedan, van, SUV, or motorcycle.",
    };
  }

  const parsedSeatCapacity = Number(seat_capacity);

  if (!Number.isInteger(parsedSeatCapacity)) {
    return {
      success: false,
      code: "INVALID_SEAT_CAPACITY",
      message: "Seat capacity must be a valid number.",
    };
  }

  if (parsedSeatCapacity <= 0) {
    return {
      success: false,
      code: "INVALID_SEAT_CAPACITY",
      message: "Seat capacity must be greater than 0",
    };
  }

  const driver = await createDriverProfile({
    user_id,
    vehicle_type: cleanVehicleType,
    seat_capacity: parsedSeatCapacity,
  });

  return {
    success: true,
    code: "DRIVER_PROFILE_CREATED",
    message: "Driver profile created successfully.",
    data: {
      driver_profile_id: driver.driver_profile_id,
      vehicle_type: driver.vehicle_type,
      seat_capacity: driver.seat_capacity,
    },
  };
}

async function getDriverProfileByUserIdService(user_id) {
  if (!user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID must be provided.",
    };
  }
  if (!isValidUUID(user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "User ID is not a valid UUID.",
    };
  }

  const driver = await getDriverProfileByUserId(user_id);

  if (!driver) {
    return {
      success: false,
      code: "DRIVER_PROFILE_NOT_FOUND",
      message: "No driver profile found with the provided ID",
    };
  }

  return {
    success: true,
    code: "FETCH_DRIVER_PROFILE_SUCCESS",
    message: "Driver profile retrieved successfully.",
    data: driver,
  };
}

async function updateDriverProfileService(driver_profile_id, updatedData) {
  if (!driver_profile_id) {
    return {
      success: false,
      code: "MISSING_DRIVER_PROFILE_ID",
      message: "Driver profile ID must be provided.",
    };
  }

  if (!isValidUUID(driver_profile_id)) {
    return {
      success: false,
      code: "INVALID_DRIVER_PROFILE_ID",
      message: "Driver profile ID is not a valid UUID.",
    };
  }

  const existingDriverProfile = await findDriverProfileById(driver_profile_id);
  if (!existingDriverProfile) {
    return {
      success: false,
      code: "DRIVER_PROFILE_NOT_FOUND",
      message: "No driver profile found with the provided ID.",
    };
  }

  if (updatedData.vehicle_type) {
    const allowedVehicleTypes = ["sedan", "van", "suv", "motorcycle"];
    const cleanVehicleType = updatedData.vehicle_type.toLowerCase().trim();

    if (!allowedVehicleTypes.includes(cleanVehicleType)) {
      return {
        success: false,
        code: "INVALID_VEHICLE_TYPE",
        message: "Vehicle type must be one of: sedan, van, suv, or motorcycle.",
      };
    }

    updatedData.vehicle_type = cleanVehicleType;
  }

  if (updatedData.seat_capacity !== undefined) {
    const parsedSeatCapacity = Number(updatedData.seat_capacity);

    if (!Number.isInteger(parsedSeatCapacity) || parsedSeatCapacity <= 0) {
      return {
        success: false,
        code: "INVALID_SEAT_CAPACITY",
        message: "Seat capacity must be a positive integer greater than 0.",
      };
    }

    updatedData.seat_capacity = parsedSeatCapacity;
  }

  if (Object.keys(updatedData).length === 0) {
    return {
      success: false,
      code: "MISSING_UPDATE_FIELDS",
      message: "No fields provided to update.",
    };
  }

  const driver = await updateDriverProfile(driver_profile_id, updatedData);

  return {
    success: true,
    code: "DRIVER_PROFILE_UPDATED",
    message: "Driver profile updated successfully.",
    data: driver,
  };
}

async function getMyDriverProfileService(user_id) {
  if (!user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required",
    };
  }

  if (!isValidUUID(user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "User ID must be a valid UUID.",
    };
  }

  const user = await findUserById(user_id);
  if (!user) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "No user found for the given ID.",
    };
  }

  const driver = await getMyDriverProfile(user_id);
  if (!driver) {
    return {
      success: false,
      code: "DRIVER_PROFILE_NOT_FOUND",
      message: "No driver profile found for this user.",
    };
  }

  return {
    success: true,
    code: "FETCH_MY_DRIVER_PROFILE_SUCCESS",
    message: "Driver profile retrieved successfully.",
    data: driver,
  };
}

module.exports = {
  createDriverProfileService,
  getDriverProfileByUserIdService,
  updateDriverProfileService,
  getMyDriverProfileService,
};
