const pool = require("../../config/db");

async function findRideOfferById(ride_offer_id) {
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
        passenger_user_id,  
        status 
     FROM offer_requests
     WHERE ride_offer_id = $1 AND passenger_user_id = $2 AND status = 'pending'`,
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

async function getOfferRequestById(offer_request_id) {
  const result = await pool.query(
    `SELECT
            offer_request_id,
            ride_offer_id,
            passenger_user_id,
            requested_seats,
            message,
            status,
            created_at,
            updated_at
        FROM offer_requests
        WHERE offer_request_id = $1`,
    [offer_request_id],
  );
  return result.rows[0];
}

async function getOfferRequestsByOffer(ride_offer_id) {
  const result = await pool.query(
    `SELECT
            offer_request_id,
            ride_offer_id,
            passenger_user_id,
            requested_seats,
            message,
            status,
            created_at,
            updated_at
        FROM offer_requests
        WHERE ride_offer_id = $1`,
    [ride_offer_id],
  );
  return result.rows;
}

async function getMyOfferRequest(passenger_user_id) {
  const result = await pool.query(
    `SELECT 
        o.offer_request_id,
        o.ride_offer_id,
        o.passenger_user_id,
        o.requested_seats,
        o.message,
        o.status AS offer_request_status,
        o.created_at,
        o.updated_at,
        r.pickup_location,
        r.dropoff_location,
        r.departure_time,
        r.available_seats,
        r.status AS ride_offer_status    
    FROM offer_requests o
    LEFT JOIN ride_offers r
        ON o.ride_offer_id = r.ride_offer_id
    WHERE o.passenger_user_id = $1
    ORDER BY o.created_at DESC`,
    [passenger_user_id],
  );
  return result.rows;
}

async function cancelOfferRequest(passenger_user_id) {
  const result = await pool.query(
    `UPDATE offer_requests
        SET status = 'cancelled',
            updated_at = NOW()
        WHERE offer_request_id = $1
        RETURNING *`,
    [passenger_user_id],
  );
  return result.rows[0];
}

module.exports = {
  findExistingPendingOfferRequest,
  createOfferRequest,
  getOfferRequestById,
  findRideOfferById,
  getOfferRequestsByOffer,
  getMyOfferRequest,
  cancelOfferRequest,
};
