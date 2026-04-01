const {
  findDriverProfileByUserId,
  createRiderOffer,
} = require("./ride_offers.repository");

const { isValidUUID } = require("./../../utils/security");
const { cleanName } = require("./../../utils/helper");
function cleanLocation(str) {
  if (!str) return null;
  const normalized = str.trim();
  return normalized.length > 0 ? normalized : null;
}

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

  const pickupLocation = cleanLocation(pickup_location);
  const dropofflocation = cleanLocation(dropoff_location);

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

  const note = cleanName(notes);
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

module.exports = { createRideOfferService };
