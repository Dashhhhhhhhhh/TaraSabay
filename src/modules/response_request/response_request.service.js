const {
  createRequestResponse,

  getRideRequestById,
  getRequestResponseByDriverAndRequest,
  driverExists,
  getRequestResponseWithRelations,
  getRequestResponsesByRideRequestId,
  getMyRequestResponse,
} = require("./response_request.repository");

const { isValidUUID } = require("./../../utils/security");
const { cleanString } = require("./../../utils/helper");

async function createRequestResponseService(requestData) {
  const { ride_request_id, driver_user_id, message } = requestData;

  if (!driver_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "Driver user ID is required.",
    };
  }
  if (!isValidUUID(driver_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Driver user ID must be a valid UUID.",
    };
  }

  if (!ride_request_id) {
    return {
      success: false,
      code: "MISSING_RIDE_REQUEST_ID",
      message: "Ride request ID is required.",
    };
  }
  if (!isValidUUID(ride_request_id)) {
    return {
      success: false,
      code: "INVALID_RIDE_REQUEST_ID",
      message: "Ride request ID must be a valid UUID.",
    };
  }

  const rideRequest = await getRideRequestById(ride_request_id);
  if (!rideRequest) {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_FOUND",
      message: "No ride request exists for the given ID.",
    };
  }

  if (rideRequest.status !== "open") {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_OPEN",
      message: "Ride request is not open.",
    };
  }

  if (rideRequest.rider_user_id === driver_user_id) {
    return {
      success: false,
      code: "SELF_RESPONSE_NOT_ALLOWED",
      message: "You cannot respond to your own ride request.",
    };
  }

  const cleanedMessage = cleanString(message);
  if (cleanedMessage && cleanedMessage.length > 500) {
    return {
      success: false,
      code: "INVALID_MESSAGE",
      message: "Message is too long (max 500 characters).",
    };
  }

  const existingResponse = await getRequestResponseByDriverAndRequest(
    ride_request_id,
    driver_user_id,
  );
  if (existingResponse) {
    return {
      success: false,
      code: "DUPLICATE_PENDING_RESPONSE",
      message: "You have already responded to this ride request.",
    };
  }

  const checkExistingDriver = await driverExists(driver_user_id);
  if (!checkExistingDriver) {
    return {
      success: false,
      code: "DRIVER_PROFILE_REQUIRED",
      message: "Driver profile does not exist for the given user ID.",
    };
  }

  const createdResponse = await createRequestResponse({
    ride_request_id,
    driver_user_id,
    message: cleanedMessage,
  });

  return {
    success: true,
    code: "REQUEST_RESPONSE_CREATED",
    message: "Request response successfully created.",
    data: {
      request_response_id: createdResponse.request_response_id,
      ride_request_id: createdResponse.ride_request_id,
      driver_user_id: createdResponse.driver_user_id,
      message: createdResponse.message,
      status: createdResponse.status,
    },
  };
}

async function getRequestResponseByIdservice(
  request_response_id,
  user_id,
  role,
) {
  if (!user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }
  if (!isValidUUID(user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "User ID must be a valid UUID.",
    };
  }

  if (!request_response_id) {
    return {
      success: false,
      code: "MISSING_REQUEST_RESPONSE_ID",
      message: "Request response ID is required.",
    };
  }
  if (!isValidUUID(request_response_id)) {
    return {
      success: false,
      code: "INVALID_REQUEST_RESPONSE_ID",
      message: "Request response ID must be a valid UUID.",
    };
  }

  const requestResponse =
    await getRequestResponseWithRelations(request_response_id);

  if (!requestResponse) {
    return {
      success: false,
      code: "REQUEST_RESPONSE_NOT_FOUND",
      message: "No request response found for the given ID.",
    };
  }

  if (
    requestResponse.driver_user_id !== user_id &&
    requestResponse.rider_user_id !== user_id &&
    role !== "Admin"
  ) {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to view this request response.",
    };
  }

  return {
    success: true,
    code: "FETCH_REQUEST_RESPONSE_SUCCESS",
    message: "Request response retrieved successfully.",
    data: requestResponse,
  };
}

async function getRequestResponsesByRideRequestIdService(
  ride_request_id,
  user_id,
  role,
) {
  if (!ride_request_id) {
    return {
      success: false,
      code: "MISSING_RIDE_REQUEST_ID",
      message: "Ride request ID is required.",
    };
  }
  if (!isValidUUID(ride_request_id)) {
    return {
      success: false,
      code: "INVALID_RIDE_REQUEST_ID",
      message: "Ride request ID must be a valid UUID.",
    };
  }

  const rideRequest = await getRideRequestById(ride_request_id);
  if (!rideRequest) {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_FOUND",
      message: "No ride request found for the given id",
    };
  }

  if (rideRequest.rider_user_id !== user_id && role !== admin) {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to view this request response.",
    };
  }

  const request = await getRequestResponsesByRideRequestId(ride_request_id);

  return {
    success: true,
    code: "FETCH_REQUEST_RESPONSES_SUCCES",
    message: "Request responses retrieved successfully",
    data: request,
  };
}

async function getMyRequestResponseService(driver_user_id) {
  if (!driver_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }

  if (!isValidUUID(driver_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "User ID must be a valid UUID.",
    };
  }
  const driver = await getMyRequestResponse(driver_user_id);

  return {
    success: true,
    code: "FETCH_MY_REQUEST_RESPONSES_SUCCESS",
    message:
      driver.length === 0
        ? "No request responses found for this profile."
        : "Request responses retrieved successfully.",
    data: driver,
  };
}

module.exports = {
  createRequestResponseService,
  getRequestResponseByIdservice,
  getRequestResponsesByRideRequestIdService,
  getMyRequestResponseService,
};
