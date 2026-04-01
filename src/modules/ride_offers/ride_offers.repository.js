const pool = require("../../config/db");

async function findDriverProfileByUserId(user_id) {
  const result = await pool.query(
    `SELECT 
            driver_profile_id,
            user_id,
            vehicle_type,
            seat_capacity,
            created_at,
            updated_at
        FROM driver_profiles
        WHERE user_id = $1`,
    [user_id],
  );
  return result.rows[0];
}

async function createRiderOffer(offerData) {
  const result = await pool.query(
    `INSERT INTO ride_offers (
        user_id,
        driver_profile_id,
        pickup_location,
        dropoff_location,
        departure_time,
        vehicle_type_snapshot,
        seat_capacity_snapshot,
        available_seats,
        status,
        notes
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING
        ride_offer_id,
        user_id,
        driver_profile_id,
        pickup_location,
        dropoff_location,
        departure_time,
        vehicle_type_snapshot,
        seat_capacity_snapshot,
        available_seats,
        status,
        notes,
        created_at,
        updated_at`,
    [
      offerData.user_id,
      offerData.driver_profile_id,
      offerData.pickup_location,
      offerData.dropoff_location,
      offerData.departure_time,
      offerData.vehicle_type_snapshot,
      offerData.seat_capacity_snapshot,
      offerData.available_seats,
      offerData.status,
      offerData.notes,
    ],
  );

  return result.rows[0];
}

module.exports = { findDriverProfileByUserId, createRiderOffer };
