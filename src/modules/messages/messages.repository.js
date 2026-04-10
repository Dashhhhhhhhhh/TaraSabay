const pool = require("../../config/db");

async function createMessage(messageData) {
  const result = await pool.query(
    `INSERT INTO messages (
        sender_user_id,
        receiver_user_id,
        ride_offer_id,
        ride_request_id,
        message_text,
        is_read
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
        message_id,
        sender_user_id,
        receiver_user_id,
        ride_offer_id,
        ride_request_id,
        message_text,
        is_read,
        created_at,
        updated_at`,
    [
      messageData.sender_user_id,
      messageData.receiver_user_id,
      messageData.ride_offer_id,
      messageData.ride_request_id,
      messageData.message_text,
      messageData.is_read,
    ],
  );
  return result.rows[0];
}

async function findUserById(user_id) {
  const result = await pool.query(
    `SELECT
      user_id,
      display_name,
      is_active
    FROM users
    WHERE user_id = $1`,
    [user_id],
  );
  return result.rows[0];
}

async function findRideOfferOwnerById(ride_offer_id) {
  const result = await pool.query(
    `SELECT
      user_id AS owner_user_id
    FROM ride_offers
    WHERE ride_offer_id = $1
    LIMIT 1`,
    [ride_offer_id],
  );
  return result.rows[0] || null;
}
async function findRideRequestOwnerById(ride_request_id) {
  const result = await pool.query(
    `SELECT
        rider_user_id AS owner_user_id
      FROM ride_requests
      WHERE ride_request_id = $1
      LIMIT 1`,
    [ride_request_id],
  );
  return result.rows[0] || null;
}

async function findOfferRequestByRideOfferAndPassenger(
  ride_offer_id,
  passenger_user_id,
) {
  const result = await pool.query(
    `SELECT
      offer_request_id,
      ride_offer_id,
      passenger_user_id,
      status
    FROM offer_requests
    WHERE ride_offer_id = $1 AND passenger_user_id = $2`,
    [ride_offer_id, passenger_user_id],
  );
  return result.rows[0];
}

async function findRequestResponseByRideRequestAndDriver(
  ride_request_id,
  driver_user_id,
) {
  const result = await pool.query(
    `SELECT
      request_response_id,
      ride_request_id,
      driver_user_id,
      status
    FROM request_responses
    WHERE ride_request_id =$1 AND driver_user_id = $2`,
    [ride_request_id, driver_user_id],
  );
  return result.rows[0];
}

module.exports = {
  createMessage,
  findUserById,
  findRideOfferOwnerById,
  findRideRequestOwnerById,
  findOfferRequestByRideOfferAndPassenger,
  findRequestResponseByRideRequestAndDriver,
};
