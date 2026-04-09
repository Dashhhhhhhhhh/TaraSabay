const pool = require("../../config/db");

async function createRequestResponse(responseData) {
  const result = await pool.query(
    `INSERT INTO request_responses (
        ride_request_id,
        driver_user_id,
        message
    )
    VALUES ($1, $2, $3)
    RETURNING
        request_response_id,
        ride_request_id,
        driver_user_id,
        message,
        status,
        created_at,
        updated_at`,
    [
      responseData.ride_request_id,
      responseData.driver_user_id,
      responseData.message,
    ],
  );
  return result.rows[0];
}

async function getRideRequestById(ride_request_id) {
  const result = await pool.query(
    `SELECT
        ride_request_id,
        rider_user_id,
        pickup_location,
        dropoff_location,
        departure_time,
        requested_seats,
        notes,
        status,
        created_at,
        updated_at
     FROM ride_requests
     WHERE ride_request_id = $1`,
    [ride_request_id],
  );
  return result.rows[0];
}

async function getRequestResponseByDriverAndRequest(
  ride_request_id,
  driver_user_id,
) {
  const result = await pool.query(
    `SELECT * FROM request_responses
     WHERE ride_request_id = $1 
       AND driver_user_id = $2
       AND status = 'pending'
     LIMIT 1;`,
    [ride_request_id, driver_user_id],
  );
  return result.rows[0];
}

async function driverExists(user_id) {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1 FROM driver_profiles WHERE user_id = $1
     ) AS exists`,
    [user_id],
  );
  return result.rows[0].exists;
}

async function getRequestResponseWithRelations(request_response_id) {
  const result = await pool.query(
    `SELECT
        rr.request_response_id,
        rr.ride_request_id,
        rr.driver_user_id,
        rr.message,
        rr.status,
        rr.created_at,
        rr.updated_at,
        d.first_name || ' ' || d.last_name AS driver_full_name,
        d.display_name AS driver_display_name,
        r.rider_user_id,
        ru.first_name || ' ' || ru.last_name AS rider_full_name,
        ru.display_name AS rider_display_name
     FROM request_responses rr
     LEFT JOIN users d
       ON rr.driver_user_id = d.user_id
     LEFT JOIN ride_requests r
       ON rr.ride_request_id = r.ride_request_id
     LEFT JOIN users ru
       ON r.rider_user_id = ru.user_id
     WHERE rr.request_response_id = $1`,
    [request_response_id],
  );
  return result.rows[0];
}

async function getRequestResponsesByRideRequestId(ride_request_id) {
  const result = await pool.query(
    `SELECT 
        rr.request_response_id,
        rr.ride_request_id,
        rr.driver_user_id,
        rr.message,
        rr.status,
        rr.created_at,
        rr.updated_at,
        u.first_name || ' ' || u.last_name AS driver_full_name,
        u.display_name AS driver_display_name
     FROM request_responses rr
     LEFT JOIN users u
        ON rr.driver_user_id = u.user_id
    WHERE rr.ride_request_id = $1`,
    [ride_request_id],
  );
  return result.rows;
}

async function getMyRequestResponse(driver_user_id) {
  const result = await pool.query(
    `SELECT 
        rr.request_response_id,
        rr.ride_request_id,
        rr.driver_user_id,
        rr.message,
        rr.status,
        rr.created_at,
        rs.pickup_location,
        rs.dropoff_location,
        rs.departure_time,
        rs.requested_seats
    FROM request_responses rr
    LEFT JOIN ride_requests rs
        ON rr.ride_request_id = rs.ride_request_id
    WHERE rr.driver_user_id = $1`,
    [driver_user_id],
  );
  return result.rows;
}
module.exports = {
  createRequestResponse,
  getRideRequestById,
  getRequestResponseByDriverAndRequest,
  driverExists,
  getRequestResponseWithRelations,
  getRequestResponsesByRideRequestId,
  getMyRequestResponse,
};
