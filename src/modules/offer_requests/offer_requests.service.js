const {
  findRideOfferRequest,
  findExistingPendingOfferRequest,
  createOfferRequest,
} = require("./offer_requests.repository");

const { isValidUUID } = require("./../../utils/security");

const { cleanString, isInteger, cleanName } = require("./../../utils/helper");

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
      code: "INVALID_USER_ID  ",
      message: "Invalid Ride offer ID.",
    };
  }

  if (!isValidUUID(ride_offer_id)) {
    return {
      success: false,
      code: "INVALID_RIDE_OFFER_ID ",
      message: "Invalid Ride offer ID.",
    };
  }

  const parsedRequestedSeats = Number(requested_seats);

  if (!Number.isInteger(parsedRequestedSeats)) {
    return {
      success: false,
      code: "INVALID_REQUESTED_SEATS ",
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

  const rideOffer = await findRideOfferRequest(ride_offer_id);
  if (!rideOffer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
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

  if (requested_seats > rideOffer.available_seats) {
    return {
      success: false,
      code: "REQUESTED_SEATS_EXCEED_AVAILABLE_SEATS",
      message:
        "Requested seats exceed the number of available seats for this ride offer.",
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
    status: requestData.status || "pending",
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

module.exports = { createOfferRequestService };
