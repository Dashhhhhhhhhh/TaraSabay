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

async function findRideOfferWithDriverInfoByiD(ride_offer_id) {
  const result = await pool.query(
    `SELECT
            r.ride_offer_id,
            r.pickup_location,
            r.dropoff_location,
            r.departure_time,
            r.vehicle_type_snapshot,
            r.seat_capacity_snapshot,
            r.available_seats,
            r.status,
            r.notes,
            r.created_at,
            r.updated_at,
            u.first_name || ' ' || u.last_name AS user_full_name
        FROM ride_offers r
        LEFT JOIN users u
            ON r.user_id = u.user_id
        WHERE r.ride_offer_id = $1`,
    [ride_offer_id],
  );
  return result.rows[0];
}

async function getAllRideOffers() {
  const result = await pool.query(
    `SELECT
            r.ride_offer_id,
            r.pickup_location,
            r.dropoff_location,
            r.departure_time,
            r.vehicle_type_snapshot,
            r.seat_capacity_snapshot,
            r.available_seats,
            r.status,
            r.notes,
            r.created_at,
            r.updated_at,
            u.first_name || ' ' || u.last_name AS user_full_name
        FROM ride_offers r
        LEFT JOIN users u
            ON r.user_id = u.user_id
        WHERE r.status = 'open'
        ORDER BY r.departure_time ASC`,
  );
  return result.rows;
}

async function updateRideOffer(ride_offer_id, updateData) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  values.push(ride_offer_id);

  const query = `
    UPDATE ride_offers
    SET ${fields.join(", ")}
    WHERE ride_offer_id = $${idx}
    RETURNING *;
    `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function cancelRideOffer(ride_offer_id) {
  const result = await pool.query(
    `UPDATE ride_offers
     SET status = 'cancelled',
         updated_at = NOW()
     WHERE ride_offer_id = $1
     RETURNING *`,
    [ride_offer_id],
  );
  return result.rows[0];
}

async function getRideOfferById(ride_offer_id) {
  const result = await pool.query(
    `SELECT
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
          updated_at
        FROM ride_offers
        WHERE ride_offer_id = $1`,
    [ride_offer_id],
  );
  return result.rows[0];
}

module.exports = {
  findDriverProfileByUserId,
  createRiderOffer,
  findRideOfferWithDriverInfoByiD,
  getAllRideOffers,
  updateRideOffer,
  cancelRideOffer,
  getRideOfferById,
};
