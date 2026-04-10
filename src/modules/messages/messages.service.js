const {
  createMessage,
  findUserById,
  findRideOfferOwnerById,
  findRideRequestOwnerById,
  findOfferRequestByRideOfferAndPassenger,
  findRequestResponseByRideRequestAndDriver,
} = require("./messages.repository");

const { isValidUUID } = require("./../../utils/security");
const { cleanString } = require("./../../utils/helper");

async function createMessageService(messageData) {
  const {
    sender_user_id,
    receiver_user_id,
    ride_offer_id,
    ride_request_id,
    message_text,
  } = messageData;

  if (!sender_user_id)
    return {
      success: false,
      code: "MISSING_USER_ID",
      message: "Sender user ID is required.",
    };
  if (!isValidUUID(sender_user_id))
    return {
      success: false,
      code: "INVALID_USER_ID",
      message: "Sender user ID must be a valid UUID.",
    };

  if (!receiver_user_id)
    return {
      success: false,
      code: "MISSING_RECEIVER_USER_ID",
      message: "Receiver user ID is required.",
    };
  if (!isValidUUID(receiver_user_id))
    return {
      success: false,
      code: "INVALID_RECEIVER_USER_ID",
      message: "Receiver user ID must be a valid UUID.",
    };

  if (sender_user_id === receiver_user_id) {
    return {
      success: false,
      code: "CANNOT_MESSAGE_SELF",
      message: "You cannot send a message to yourself.",
    };
  }

  const message = cleanString(message_text);
  if (!message || message.length === 0) {
    return {
      success: false,
      code: "EMPTY_MESSAGE_TEXT",
      message: "Message cannot be empty.",
    };
  }
  if (message && message.length > 1000) {
    return {
      success: false,
      code: "INVALID_MESSAGE_TEXT",
      message: "Message is too long (max 1000 characters).",
    };
  }

  if (
    (ride_offer_id && ride_request_id) ||
    (!ride_offer_id && !ride_request_id)
  ) {
    return {
      success: false,
      code: "INVALID_CONTEXT",
      message:
        "Message must belong to exactly one context: ride offer or ride request.",
    };
  }

  const sender = await findUserById(sender_user_id);
  if (!sender) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "Sender user does not exist.",
    };
  }

  const receiver = await findUserById(receiver_user_id);
  if (!receiver) {
    return {
      success: false,
      code: "USER_NOT_FOUND",
      message: "Receiver user does not exist.",
    };
  }

  if (ride_offer_id) {
    const offer = await findRideOfferOwnerById(ride_offer_id);
    if (!offer) {
      return {
        success: false,
        code: "RIDE_OFFER_NOT_FOUND",
        message: "No ride offer exists with the provided ID.",
      };
    }

    let passengerCandidate;

    if (sender_user_id === offer.owner_user_id) {
      passengerCandidate = receiver_user_id;
    } else if (receiver_user_id === offer.owner_user_id) {
      passengerCandidate = sender_user_id;
    } else {
      return {
        success: false,
        code: "INVALID_RELATION_PAIR",
        message: "Invalid relationship pair.",
      };
    }

    const offerRequest = await findOfferRequestByRideOfferAndPassenger(
      ride_offer_id,
      passengerCandidate,
    );

    if (!offerRequest) {
      return {
        success: false,
        code: "PASSENGER_NOT_ASSOCIATED_WITH_RIDE_OFFER",
        message: "Passenger is not associated with this ride offer.",
      };
    }
  } else if (ride_request_id) {
    const request = await findRideRequestOwnerById(ride_request_id);
    if (!request) {
      return {
        success: false,
        code: "RIDE_REQUEST_NOT_FOUND",
        message: "No ride request exists with the provided ID.",
      };
    }

    let driverCandidate;

    if (sender_user_id === request.owner_user_id) {
      driverCandidate = receiver_user_id;
    } else if (receiver_user_id === request.owner_user_id) {
      driverCandidate = sender_user_id;
    } else {
      return {
        success: false,
        code: "INVALID_RELATION_PAIR",
        message: "Invalid relationship pair.",
      };
    }

    const requestResponse = await findRequestResponseByRideRequestAndDriver(
      ride_request_id,
      driverCandidate,
    );

    if (!requestResponse) {
      return {
        success: false,
        code: "DRIVER_NOT_FOUND",
        message: "Driver is not associated with this ride request.",
      };
    }
  }

  const newMessage = await createMessage({
    sender_user_id: sender_user_id,
    receiver_user_id: receiver_user_id,
    ride_offer_id: ride_offer_id,
    ride_request_id: ride_request_id,
    message_text: message,
    is_read: false,
  });

  return {
    success: true,
    code: "MESSAGE_CREATED_SUCCESS",
    message: "Message created successfully",
    data: newMessage,
  };
}

module.exports = { createMessageService };
