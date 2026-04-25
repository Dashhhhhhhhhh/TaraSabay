const {
  findExistingPendingOfferRequest,
  createOfferRequest,
  getOfferRequestById,
  findRideOfferById,
  getOfferRequestsByOffer,
  getMyOfferRequest,
  cancelOfferRequest,
  updateOfferRequestStatus,
  decreaseAvailableSeats,
  updateRideOfferStatus,
} = require("./offer_requests.repository");

const { isValidUUID } = require("./../../utils/security");

const { cleanName } = require("./../../utils/helper");

async function createOfferRequestService(requestData) {
  const { ride_offer_id, passenger_user_id, requested_seats, message } =
    requestData;

  if (!ride_offer_id || !requested_seats) {
    return {
      success: false,
      code: "MISSING_REQUIRED_FIELDS",
      message: "All required fields must be provided.",
    };
  }

  if (!isValidUUID(passenger_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid Ride offer ID.",
    };
  }

  if (!isValidUUID(ride_offer_id)) {
    return {
      success: false,
      code: "INVALID_RIDE_OFFER_ID",
      message: "Invalid Ride offer ID.",
    };
  }

  const parsedRequestedSeats = Number(requested_seats);

  if (!Number.isInteger(parsedRequestedSeats)) {
    return {
      success: false,
      code: "INVALID_REQUESTED_SEATS",
      message: "Requested seat must be a valid number.",
    };
  }

  if (parsedRequestedSeats <= 0) {
    return {
      success: false,
      code: "INVALID_SEAT_CAPACITY",
      message: "Requested seats must be greater than 0",
    };
  }

  const messages = cleanName(message);
  if (messages && messages.length > 500) {
    return {
      success: false,
      code: "INVALID_MESSAGE",
      message: "Message is too long (max 500 characters).",
    };
  }

  const rideOffer = await findRideOfferById(ride_offer_id);
  if (!rideOffer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }

  if (parsedRequestedSeats > rideOffer.available_seats) {
    return {
      success: false,
      code: "EXCEEDS_AVAILABLE_SEATS",
      message: `Only ${rideOffer.available_seats} seats are available`,
    };
  }

  if (rideOffer.status !== "open") {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_OPEN",
      message: "Ride offer must be open to accept requests.",
    };
  }

  if (rideOffer.user_id === passenger_user_id) {
    return {
      success: false,
      code: "CANNOT_REQUEST_OWN_RIDE",
      message: "You cannot request your own ride offer.",
    };
  }

  const existingOffer = await findExistingPendingOfferRequest(
    ride_offer_id,
    passenger_user_id,
  );

  if (existingOffer) {
    return {
      success: false,
      code: "DUPLICATE_PENDING_REQUEST",
      message: "You already have a pending request for this ride offer.",
    };
  }

  const offer = await createOfferRequest({
    ride_offer_id: ride_offer_id,
    passenger_user_id,
    requested_seats: parsedRequestedSeats,
    message: messages,
    status: "pending",
  });

  return {
    success: true,
    message: "Your request to join the ride has been created",
    data: {
      offer_request_id: offer.offer_request_id,
      passenger_user_id: offer.passenger_user_id,
      requested_seats: offer.requested_seats,
      message: offer.message,
      status: offer.status,
    },
  };
}

async function getOfferRequestByIdService(offer_request_id, user_id, role) {
  if (!offer_request_id) {
    return {
      success: false,
      code: "MISSING_OFFER_REQUEST_ID",
      message: "Offer request ID is required.",
    };
  }

  if (!isValidUUID(offer_request_id)) {
    return {
      success: false,
      code: "INVALID_OFFER_REQUEST_ID",
      message: "Invalid offer request ID.",
    };
  }

  const offer = await getOfferRequestById(offer_request_id);

  if (!offer) {
    return {
      success: false,
      code: "OFFER_REQUEST_NOT_FOUND",
      message: "Offer request not found.",
    };
  }

  if (offer.passenger_user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to access this offer request.",
    };
  }

  return {
    success: true,
    code: "FETCH_OFFER_REQUEST_SUCCESS",
    message: "Offer request fetched successfully.",
    data: offer,
  };
}

async function getOfferRequestsByOfferService(ride_offer_id, user_id, role) {
  if (!ride_offer_id) {
    return {
      success: false,
      code: "MISSING_RIDE_OFFER_ID",
      message: "Ride offer ID is required.",
    };
  }

  if (!isValidUUID(ride_offer_id)) {
    return {
      success: false,
      code: "INVALID_RIDE_OFFER_ID",
      message: "Invalid ride offer ID.",
    };
  }

  const existingRideOffer = await findRideOfferById(ride_offer_id);
  if (!existingRideOffer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }
  if (existingRideOffer.user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message:
        "You are not authorized to access the offer requests for this ride offer.",
    };
  }

  const offerRequests = await getOfferRequestsByOffer(ride_offer_id);

  return {
    success: true,
    code: "FETCH_OFFER_REQUESTS_SUCCESS",
    message: "Offer requests fetched successfully.",
    offerRequests,
  };
}

async function getMyOfferRequestService(passenger_user_id, offer_request_id) {
  if (!offer_request_id) {
    return {
      success: false,
      code: "MISSING_PASSENGER_USER_ID",
      message: "Passenger user ID is required.",
    };
  }
  if (!isValidUUID(passenger_user_id)) {
    return {
      success: false,
      code: "INVALID_PASSENGER_USER_ID",
      message: "Invalid ride offer ID.",
    };
  }

  const myOffer = await getMyOfferRequest(passenger_user_id);

  return {
    success: true,
    code: "FETCH_MY_OFFER_REQUESTS_SUCCESS",
    message: "Offer request fetched successfully.",
    data: myOffer,
  };
}

async function cancelOfferRequestService(
  offer_request_id,
  passenger_user_id,
  role,
) {
  if (!offer_request_id) {
    return {
      success: false,
      code: "MISSING_OFFER_REQUEST_ID",
      message: "Offer request ID is required.",
    };
  }

  if (!isValidUUID(offer_request_id)) {
    return {
      success: false,
      code: "INVALID_OFFER_REQUEST_ID",
      message: "Invalid offer request ID.",
    };
  }

  if (!passenger_user_id) {
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  }

  if (!isValidUUID(passenger_user_id)) {
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid user ID.",
    };
  }

  const existingOfferRequest = await getOfferRequestById(offer_request_id);

  if (!existingOfferRequest) {
    return {
      success: false,
      code: "OFFER_REQUEST_NOT_FOUND",
      message: "No offer request exists for the given ID.",
    };
  }

  if (
    existingOfferRequest.passenger_user_id !== passenger_user_id &&
    role !== "Admin"
  ) {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to cancel this offer request.",
    };
  }

  if (existingOfferRequest.status !== "pending") {
    return {
      success: false,
      code: "REQUEST_ALREADY_FINAL",
      message: "Only pending offer requests can be cancelled.",
    };
  }

  const cancelledOfferRequest = await cancelOfferRequest(offer_request_id);

  return {
    success: true,
    code: "OFFER_REQUEST_CANCELLED",
    message: "Offer request has been cancelled successfully.",
    data: cancelledOfferRequest,
  };
}

async function acceptOfferRequestService(offer_request_id, user_id, role) {
  if (!offer_request_id)
    return {
      success: false,
      code: "MISSING_OFFER_REQUEST_ID",
      message: "Offer request ID is required.",
    };
  if (!isValidUUID(offer_request_id))
    return {
      success: false,
      code: "INVALID_OFFER_REQUEST_ID",
      message: "Invalid offer request ID.",
    };
  if (!user_id)
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  if (!isValidUUID(user_id))
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid user ID.",
    };

  if (!role)
    return {
      success: false,
      code: "MISSING_ROLE",
      message: "Role is required.",
    };

  const existingOfferRequest = await getOfferRequestById(offer_request_id);
  if (!existingOfferRequest)
    return {
      success: false,
      code: "OFFER_REQUEST_NOT_FOUND",
      message: "No offer request exists for the given ID.",
    };

  const rideOffer = await findRideOfferById(existingOfferRequest.ride_offer_id);
  if (!rideOffer)
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "Ride offer not found.",
    };

  if (rideOffer.user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to accept this request.",
    };
  }

  if (existingOfferRequest.status !== "pending") {
    return {
      success: false,
      code: "REQUEST_ALREADY_FINAL",
      message: "Request is not pending.",
    };
  }

  if (rideOffer.status !== "open") {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_OPEN",
      message: "Ride offer is not open.",
    };
  }

  if (existingOfferRequest.requested_seats > rideOffer.available_seats) {
    return {
      success: false,
      code: "NOT_ENOUGH_AVAILABLE_SEATS",
      message: "Not enough available seats.",
    };
  }

  const updatedRideOffer = await decreaseAvailableSeats(
    rideOffer.ride_offer_id,
    existingOfferRequest.requested_seats,
  );

  if (!updatedRideOffer) {
    return {
      success: false,
      code: "NOT_ENOUGH_AVAILABLE_SEATS",
      message: "Not enough available seats.",
    };
  }

  const updatedOfferRequest = await updateOfferRequestStatus(
    offer_request_id,
    "accepted",
  );

  if (Number(updatedRideOffer.available_seats) === 0) {
    await updateRideOfferStatus(rideOffer.ride_offer_id, "full");
  }

  return {
    success: true,
    code: "OFFER_REQUEST_ACCEPTED",
    message: "Offer request accepted successfully.",
    data: {
      offerRequest: updatedOfferRequest,
      rideOffer: updatedRideOffer,
    },
  };
}

async function rejectOfferRequestService(offer_request_id, user_id, role) {
  if (!offer_request_id)
    return {
      success: false,
      code: "MISSING_OFFER_REQUEST_ID",
      message: "Offer request ID is required.",
    };
  if (!isValidUUID(offer_request_id))
    return {
      success: false,
      code: "INVALID_OFFER_REQUEST_ID",
      message: "Invalid offer request ID.",
    };
  if (!user_id)
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "User ID is required.",
    };
  if (!isValidUUID(user_id))
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Invalid user ID.",
    };

  if (!role)
    return {
      success: false,
      code: "MISSING_ROLE",
      message: "Role is required.",
    };

  const existingOfferRequest = await getOfferRequestById(offer_request_id);
  if (!existingOfferRequest)
    return {
      success: false,
      code: "OFFER_REQUEST_NOT_FOUND",
      message: "No offer request exists for the given ID.",
    };

  const rideOffer = await findRideOfferById(existingOfferRequest.ride_offer_id);
  if (!rideOffer)
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "Ride offer not found.",
    };

  if (rideOffer.user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to reject this request.",
    };
  }

  if (existingOfferRequest.status !== "pending") {
    return {
      success: false,
      code: "REQUEST_ALREADY_FINAL",
      message: "Request is not pending.",
    };
  }

  const updatedOfferRequest = await updateOfferRequestStatus(
    offer_request_id,
    "rejected",
  );

  return {
    success: true,
    code: "OFFER_REQUEST_REJECTED",
    message: "Offer request rejected successfully.",
    data: {
      offerRequest: updatedOfferRequest,
    },
  };
}

module.exports = {
  createOfferRequestService,
  getOfferRequestByIdService,
  getOfferRequestsByOfferService,
  getMyOfferRequestService,
  cancelOfferRequestService,
  acceptOfferRequestService,
  rejectOfferRequestService,
};
