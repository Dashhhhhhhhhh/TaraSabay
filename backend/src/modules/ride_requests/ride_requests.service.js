const {
  createRideRequest,
  getAllRideRequests,
  getRideRequestById,
  updateRideRequest,
  cancelRideRequest,
  getMyRideRequest,
} = require("./ride_requests.repository");

const { cleanName, cleanString, isInteger } = require("./../../utils/helper");
const { isValidUUID } = require("./../../utils/security");

async function createRideRequestService(rider_user_id, requestData) {
  const {
    ride_request_id,
    pickup_location,
    dropoff_location,
    departure_time,
    requested_seats,
    notes,
    status,
  } = requestData;

  const pickupLocation = cleanName(pickup_location);
  const dropoffLocation = cleanName(dropoff_location);

  if (
    !rider_user_id ||
    !pickupLocation ||
    !dropoffLocation ||
    !requested_seats ||
    !departure_time
  ) {
    return {
      success: false,
      code: "MISSING_REQUIRED_FIELDS",
      message: "All required fields must be provided.",
    };
  }

  if (!isValidUUID(rider_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid User ID.",
    };
  }

  if (pickupLocation === dropoff_location) {
    return {
      success: false,
      code: "SAME_PICKUP_AND_DROPOFF",
      message: "Pickup and dropoff locations must not be the same.",
    };
  }

  const departureDate = new Date(departure_time);
  if (isNaN(departureDate.getTime())) {
    return {
      success: false,
      code: "INVALID_DEPARTURE_TIME",
      message: "Departure time must be a valid timestamp.",
    };
  }

  const requestedSeats = Number(requested_seats);

  if (!Number.isInteger(requestedSeats)) {
    return {
      success: false,
      code: "INVALID_REQUESTED_SEATS",
      message: "Requested seats must be an integer.",
    };
  }
  if (requestedSeats < 0) {
    return {
      success: false,
      code: "INVALID_REQUESTED_SEATS",
      message: "Requested seats must be greater than 0.",
    };
  }

  const note = cleanString(notes);
  if (note && note.length > 500) {
    return {
      success: false,
      code: "INVALID_NOTES",
      message: "Notes is too long (max 500 characters).",
    };
  }

  const request = await createRideRequest({
    ride_request_id: ride_request_id,
    rider_user_id: rider_user_id,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    departure_time: departureDate,
    requested_seats: requestedSeats,
    notes: note,
    status: requestData.status || "open",
  });

  return {
    success: true,
    message: "Ride request created successfully.",
    data: {
      ride_request_id: request.ride_request_id,
      rider_user_id: request.rider_user_id,
      pickup_location: request.pickup_location,
      dropoff_location: request.dropoff_location,
      departure_time: request.departure_time,
      requested_seats: request.requested_seats,
      notes: request.notes,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
    },
  };
}

async function getAllRideRequestsService() {
  const request = await getAllRideRequests();

  return {
    success: true,
    code: "FETCH_RIDE_REQUESTS_SUCCESS",
    message: "Ride requests retrieved successfully.",
    data: request,
  };
}

async function getRideRequestByIdService(ride_request_id) {
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

  const request = await getRideRequestById(ride_request_id);

  if (!request) {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_FOUND",
      message: "No ride request found for the given ID.",
    };
  }

  return {
    success: true,
    code: "FETCH_RIDE_REQUEST_SUCCESS",
    message: "Ride request retrieved successfull.",
    data: request,
  };
}

async function updateRideRequestService(
  ride_request_id,
  rider_user_id,
  updatedData,
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
  if (!rider_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }
  if (!isValidUUID(rider_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid user ID.",
    };
  }

  if (!role) {
    return {
      success: false,
      code: "MISSING_ROLE",
      message: "User role is required.",
    };
  }

  if (!updatedData || typeof updatedData !== "object") {
    return {
      success: false,
      code: "INVALID_UPDATE_PAYLOAD",
      message: "Update payload must be a valid object.",
    };
  }

  const editableFields = [
    "pickup_location",
    "dropoff_location",
    "departure_time",
    "requested_seats",
    "notes",
  ];
  const filtered = {};
  for (const key of editableFields) {
    if (updatedData[key] !== undefined) {
      filtered[key] = updatedData[key];
    }
  }

  if (Object.keys(filtered).length === 0) {
    return {
      success: false,
      code: "NO_VALID_FIELDS_TO_UPDATE",
      message: "No valid fields were provided to update.",
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

  if (rideRequest.rider_user_id !== rider_user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to update this ride request.",
    };
  }

  if (rideRequest.status !== "open") {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_EDITABLE",
      message: "This ride request is not open and cannot be edited.",
    };
  }

  if (filtered.pickup_location !== undefined) {
    filtered.pickup_location = cleanName(filtered.pickup_location);
    if (filtered.pickup_location === "" || filtered.pickup_location === null) {
      return {
        success: false,
        code: "INVALID_PICKUP_LOCATION",
        message: "Pickup location cannot be empty.",
      };
    }
  }

  if (filtered.dropoff_location !== undefined) {
    filtered.dropoff_location = cleanName(filtered.dropoff_location);
    if (
      filtered.dropoff_location === "" ||
      filtered.dropoff_location === null
    ) {
      return {
        success: false,
        code: "INVALID_DROPOFF_LOCATION",
        message: "Drop-off location cannot be empty.",
      };
    }
  }

  if (filtered.departure_time !== undefined) {
    const departureDate = new Date(filtered.departure_time);
    if (isNaN(departureDate.getTime())) {
      return {
        success: false,
        code: "INVALID_DEPARTURE_TIME",
        message: "Departure time must be a valid timestamp.",
      };
    }
    filtered.departure_time = departureDate.toISOString();
  }

  if (filtered.notes !== undefined) {
    const note = cleanString(filtered.notes);
    if (note && note.length > 500) {
      return {
        success: false,
        code: "INVALID_NOTES",
        message: "Notes are too long (max 500 characters).",
      };
    }
    filtered.notes = note;
  }

  if (filtered.requested_seats !== undefined) {
    if (
      !isInteger(filtered.requested_seats) ||
      Number(filtered.requested_seats) <= 0
    ) {
      return {
        success: false,
        code: "INVALID_REQUESTED_SEATS",
        message: "Requested seats must be a positive integer.",
      };
    }
    filtered.requested_seats = Number(filtered.requested_seats);
  }

  const finalPickup = filtered.pickup_location ?? rideRequest.pickup_location;
  const finalDropoff =
    filtered.dropoff_location ?? rideRequest.dropoff_location;
  if (
    finalPickup &&
    finalDropoff &&
    cleanName(finalPickup) === cleanName(finalDropoff)
  ) {
    return {
      success: false,
      code: "SAME_PICKUP_AND_DROPOFF",
      message: "Pickup and dropoff locations must not be the same.",
    };
  }

  const request = await updateRideRequest(ride_request_id, {
    ...filtered,
  });

  return {
    success: true,
    code: "RIDE_REQUEST_UPDATED",
    message: "Ride request updated successfully.",
    data: request,
  };
}

async function cancelRideRequestService(ride_request_id, rider_user_id, role) {
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

  if (!rider_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }

  if (!isValidUUID(rider_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid user ID.",
    };
  }

  const request = await getRideRequestById(ride_request_id);

  if (!request) {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_FOUND",
      message: "No ride request exists for the given ID.",
    };
  }

  if (request.rider_user_id !== rider_user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to update this ride request.",
    };
  }

  if (request.status === "cancelled") {
    return {
      success: false,
      code: "RIDE_REQUEST_ALREADY_CANCELLED",
      message: "This ride offer has already been cancelled.",
    };
  }

  if (request.status !== "open") {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_CANCELLABLE",
      message: "Only ride requests with status 'open' can be cancelled.",
    };
  }

  const cancelRide = await cancelRideRequest(
    ride_request_id,
    rider_user_id,
    role,
  );

  if (!cancelRide) {
    return {
      success: false,
      code: "RIDE_REQUEST_NOT_FOUND",
      message: "No ride request exsits for the given ID.",
    };
  }

  return {
    success: true,
    code: "RIDE_REQUEST_CANCELLED",
    message: "Ride request cancelled successfully.",
    data: cancelRide,
  };
}

async function getMyRideRequestService(rider_user_id) {
  if (!rider_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }

  const rider = await getMyRideRequest(rider_user_id);

  return {
    success: true,
    code: "FETCH_MY_RIDE_REQUEST_SUCCESS",
    message: "Ride requests retrieved successfully.",
    data: rider,
  };
}
module.exports = {
  createRideRequestService,
  getAllRideRequestsService,
  getRideRequestByIdService,
  updateRideRequestService,
  cancelRideRequestService,
  getMyRideRequestService,
};
