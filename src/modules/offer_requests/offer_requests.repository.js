const pool = require("../../config/db");

async function findRideOfferRequest(ride_offer_id) {
  const result = await pool.query(
    `SELECT
        ride_offer_id,
        user_id,
        status,
        available_seats
    FROM ride_offers
    WHERE ride_offer_id = $1`,
    [ride_offer_id],
  );
  return result.rows[0];
}

async function findExistingPendingOfferRequest(
  ride_offer_id,
  passenger_user_id,
) {
  const result = await pool.query(
    `SELECT
        ride_offer_id,
        passenger_user_id   
     FROM offer_requests
     WHERE ride_offer_id = $1 AND passenger_user_id = $2`,
    [ride_offer_id, passenger_user_id],
  );
  return result.rows[0];
}

async function createOfferRequest(requestData) {
  const result = await pool.query(
    `INSERT INTO offer_requests (
            ride_offer_id,
            passenger_user_id,
            requested_seats,
            message,
            status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
        offer_request_id,
        ride_offer_id,
        passenger_user_id,
        requested_seats,
        message,
        status,
        created_at,
        updated_at`,
    [
      requestData.ride_offer_id,
      requestData.passenger_user_id,
      requestData.requested_seats,
      requestData.message,
      requestData.status,
    ],
  );
  return result.rows[0];
}

module.exports = {
  findRideOfferRequest,
  findExistingPendingOfferRequest,
  createOfferRequest,
};
