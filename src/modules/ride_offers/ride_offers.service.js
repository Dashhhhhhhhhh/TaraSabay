const {
  findDriverProfileByUserId,
  createRiderOffer,
  findRideOfferWithDriverInfoByiD,
  getAllRideOffers,
  updateRideOffer,
  cancelRideOffer,
  getRideOfferById,
} = require("./ride_offers.repository");

const { isValidUUID } = require("./../../utils/security");
const { cleanName, cleanString } = require("./../../utils/helper");

async function createRideOfferService(offerData) {
  const {
    user_id,
    driver_profile_id,
    pickup_location,
    dropoff_location,
    departure_time,
    available_seats,
    status,
    notes,
  } = offerData;

  const pickupLocation = cleanName(pickup_location);
  const dropofflocation = cleanName(dropoff_location);

  if (!user_id || !pickupLocation || !dropofflocation || !departure_time) {
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

  const existingDriverProfile = await findDriverProfileByUserId(user_id);
  if (!existingDriverProfile) {
    return {
      success: false,
      code: " DRIVER_PROFILE_NOT_FOUND",
      message: "No driver profile exists for the given user ID",
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

  if (departureDate <= new Date()) {
    return {
      success: false,
      code: "DEPARTURE_TIME_IN_PAST",
      message: "Departure time must be in the future.",
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

  if (existingDriverProfile.seat_capacity <= 0) {
    return {
      success: false,
      code: "INVALID_SEAT_CAPACITY",
      message: "Seat capcaity must be greater than 0",
    };
  }

  const seat_capacity_snapshot = existingDriverProfile.seat_capacity;
  const vehicle_type_snapshot = existingDriverProfile.vehicle_type;

  const availableSeats = seat_capacity_snapshot;

  const offer = await createRiderOffer({
    user_id: user_id,
    driver_profile_id: driver_profile_id,
    pickup_location: pickupLocation,
    dropoff_location: dropofflocation,
    departure_time: departureDate,
    vehicle_type_snapshot: vehicle_type_snapshot,
    seat_capacity_snapshot: seat_capacity_snapshot,
    available_seats: availableSeats,
    status: offerData.status || "open",
    notes: note,
  });

  return {
    success: true,
    message: "Ride offer created successfully.",
    data: {
      ride_offer_id: offer.ride_offer_id,
      user_id: offer.user_id,
      driver_profile_id: offer.driver_profile_id,
      pickup_location: offer.pickup_location,
      dropoff_location: offer.dropoff_location,
      departure_time: offer.departure_time,
      vehicle_type_snapshot: offer.vehicle_type_snapshot,
      seat_capacity_snapshot: offer.seat_capacity_snapshot,
      available_seats: offer.available_seats,
      status: offer.status,
      notes: offer.notes,
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    },
  };
}

async function findRideOfferWithDriverInfoByiDService(ride_offer_id) {
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
      message: "Ride offer ID must be a valid UUID.",
    };
  }

  const offer = await findRideOfferWithDriverInfoByiD(ride_offer_id);

  if (!offer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }

  return {
    success: true,
    code: "FETCH_RIDE_OFFER_SUCCESS",
    data: offer,
  };
}

async function getAllRideOffersService() {
  const offer = await getAllRideOffers();

  return {
    success: true,
    code: "FETCH_RIDE_OFFERS_SUCCESS",
    data: offer,
  };
}

async function updateRideOfferService(
  ride_offer_id,
  user_id,
  role,
  updatedData,
) {
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
      message: "Ride offer ID must be a valid UUID.",
    };
  }
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

  const rideOffer = await getRideOfferById(ride_offer_id);
  if (!rideOffer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }

  if (rideOffer.user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to update this ride offer.",
    };
  }

  if (rideOffer.status !== "open") {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_EDITABLE",
      message: "This ride offer is not open and cannot be edited.",
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

    if (departureDate < new Date()) {
      return {
        success: false,
        code: "INVALID_DEPARTURE_TIME",
        message: "Departure time must be in the future.",
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

  const finalPickup = filtered.pickup_location ?? rideOffer.pickup_location;
  const finalDropoff = filtered.dropoff_location ?? rideOffer.dropoff_location;
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

  const offer = await updateRideOffer(ride_offer_id, {
    ...filtered,
  });

  return {
    success: true,
    code: "UPDATE_RIDE_OFFER_SUCCESS",
    message: "Ride offer updated successfully.",
    data: offer,
  };
}

async function cancelRideOfferService(ride_offer_id, user_id, role) {
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
      message: "Ride offer ID must be a valid UUID.",
    };
  }

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
      message: "Invalid user ID.",
    };
  }
  const offer = await getRideOfferById(ride_offer_id);

  if (!offer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }

  if (offer.user_id !== user_id && role !== "Admin") {
    return {
      success: false,
      code: "FORBIDDEN_ACCESS",
      message: "You are not authorized to cancel this ride offer.",
    };
  }

  if (offer.status === "cancelled") {
    return {
      success: false,
      code: "RIDE_OFFER_ALREADY_CANCELLED",
      message: "This ride offer has already been cancelled.",
    };
  }

  if (offer.status !== "open") {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_CANCELLABLE",
      message: "Only ride offers with status 'open' can be cancelled.",
    };
  }

  const cancelledRideOffer = await cancelRideOffer(ride_offer_id);

  if (!cancelledRideOffer) {
    return {
      success: false,
      code: "RIDE_OFFER_NOT_FOUND",
      message: "No ride offer exists for the given ID.",
    };
  }

  return {
    success: true,
    code: "RIDE_OFFER_CANCELLED",
    message: "Ride offer successfully cancelled.",
    data: cancelledRideOffer,
  };
}
module.exports = {
  createRideOfferService,
  findRideOfferWithDriverInfoByiDService,
  getAllRideOffersService,
  updateRideOfferService,
  cancelRideOfferService,
};
