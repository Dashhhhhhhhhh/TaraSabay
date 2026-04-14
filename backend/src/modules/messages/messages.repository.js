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

async function findMessageById(message_id) {
  const result = await pool.query(
    `SELECT 
      m.message_id,
      m.sender_user_id,
      m.receiver_user_id,
      m.ride_offer_id,
      m.ride_request_id,
      m.offer_request_id,
      m.request_response_id,
      m.message_text,
      m.is_read,
      m.created_at,
      m.updated_at,
      sender.first_name || ' ' || sender.last_name AS sender_full_name,
      receiver.first_name || ' ' || receiver.last_name AS receiver_full_name,
   FROM messages m
   JOIN users sender ON m.sender_user_id = sender.user_id
   JOIN users receiver ON m.receiver_user_id = receiver.user_id
   WHERE m.message_id = $1`,
    [message_id],
  );
  return result.rows[0];
}

async function getMyMessages(user_id) {
  const result = await pool.query(
    `SELECT
      m.message_id,
      m.sender_user_id,
      m.receiver_user_id,
      m.ride_offer_id,
      m.ride_request_id,
      m.offer_request_id,
      m.request_response_id,
      m.message_text,
      m.is_read,
      m.created_at,
      m.updated_at,
      sender.first_name || ' ' || sender.last_name AS sender_full_name,
      receiver.first_name || ' ' || receiver.last_name AS receiver_full_name
    FROM messages m
    LEFT JOIN users sender ON m.sender_user_id = sender.user_id
    LEFT JOIN users receiver ON m.receiver_user_id = receiver.user_id
    WHERE m.sender_user_id = $1 OR m.receiver_user_id = $1
    ORDER BY m.created_at DESC`,
    [user_id],
  );
  return result.rows;
}

async function markMessageAsRead(message_id) {
  const result = await pool.query(
    `UPDATE messages
    SET is_read = true,
      updated_at = NOW()
    WHERE message_id = $1
    RETURNING*`,
    [message_id],
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
  findMessageById,
  getMyMessages,
  markMessageAsRead,
};
