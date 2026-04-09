const pool = require("../../config/db");

async function createRideRequest(requestData) {
  const result = await pool.query(
    `INSERT INTO ride_requests (
        rider_user_id,
        pickup_location,
        dropoff_location,
        departure_time,
        requested_seats,
        notes,
        status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
        ride_request_id,
        rider_user_id,
        pickup_location,
        dropoff_location,
        departure_time,
        requested_seats,
        notes,
        status,
        created_at,
        updated_At`,
    [
      requestData.rider_user_id,
      requestData.pickup_location,
      requestData.dropoff_location,
      requestData.departure_time,
      requestData.requested_seats,
      requestData.notes,
      requestData.status,
    ],
  );
  return result.rows[0];
}

async function getAllRideRequests() {
  const result = await pool.query(
    `SELECT
      rq.ride_request_id,
      rq.rider_user_id,
      rq.pickup_location,
      rq.dropoff_location,
      rq.departure_time,
      rq.requested_seats,
      rq.notes,
      rq.status,
      rq.created_at,
      rq.updated_at,
      u.first_name || ' ' || u.last_name AS user_full_name,
      u.display_name
    FROM ride_requests rq
    LEFT JOIN users u
      ON rq.rider_user_id = u.user_id 
    ORDER BY created_at DESC`,
  );
  return result.rows;
}

async function getRideRequestById(ride_request_id) {
  const result = await pool.query(
    `SELECT
      rq.ride_request_id,
      rq.rider_user_id,
      rq.pickup_location,
      rq.dropoff_location,
      rq.departure_time,
      rq.requested_seats,
      rq.notes,
      rq.status,
      rq.created_at,
      rq.updated_at,
      u.first_name || ' ' || u.last_name AS user_full_name,
      u.display_name
    FROM ride_requests rq
    LEFT JOIN users u
      ON rq.rider_user_id = u.user_id 
    WHERE rq.ride_request_id = $1`,
    [ride_request_id],
  );

  return result.rows[0];
}

async function updateRideRequest(ride_request_id, updateData) {
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

  values.push(ride_request_id);

  const query = `
    UPDATE ride_requests
    SET ${fields.join(", ")}
    WHERE ride_request_id = $${idx}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function cancelRideRequest(ride_request_id) {
  const result = await pool.query(
    `UPDATE ride_requests
    SET status = 'cancelled',
      updated_at = NOW()
    WHERE ride_request_id = $1
    RETURNING *`,
    [ride_request_id],
  );
  return result.rows[0];
}

module.exports = {
  createRideRequest,
  getAllRideRequests,
  getRideRequestById,
  updateRideRequest,
  cancelRideRequest,
};
