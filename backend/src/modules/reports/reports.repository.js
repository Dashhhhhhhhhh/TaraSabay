const pool = require("../../config/db");

async function createReport(reportData) {
  const result = await pool.query(
    `INSERT INTO reports (
            reported_by_user_id,
            reported_user_id,
            ride_offer_id,
            ride_request_id,
            message_id,
            reason,
            details
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            reported_by_user_id,
            reported_user_id,
            ride_offer_id,
            ride_request_id,
            message_id,
            reason,
            details,
            created_at,
            updated_at`,
    [
      reportData.reported_by_user_id,
      reportData.reported_user_id,
      reportData.ride_offer_id,
      reportData.ride_request_id,
      reportData.message_id,
      reportData.reason,
      reportData.details,
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
  return result.rows[0] || null;
}

async function findRideOfferById(ride_offer_id) {
  const result = await pool.query(
    `SELECT
        ride_offer_id
    FROM ride_offers
    WHERE ride_offer_id = $1
    LIMIT 1`,
    [ride_offer_id],
  );
  return result.rows[0] || null;
}

async function findRideRequestById(ride_request_id) {
  const result = await pool.query(
    `SELECT
        ride_request_id
    FROM ride_requests
    WHERE ride_request_id = $1
    LIMIT 1`,
    [ride_request_id],
  );
  return result.rows[0] || null;
}

async function findMessageById(message_id) {
  const result = await pool.query(
    `SELECT
        message_id
    FROM messages
    WHERE message_id = $1
    LIMIT 1`,
    [message_id],
  );
  return result.rows[0] || null;
}

async function findReportById(report_id) {
  const result = await pool.query(
    `SELECT
            report_id,
            reported_by_user_id,
            reported_user_id,
            ride_offer_id,
            ride_request_id,
            message_id,
            reason,
            details,
            status,
            created_at,
            updated_at
        FROM reports
        WHERE report_id = $1
        LIMIT 1`,
    [report_id],
  );
  return result.rows[0] || null;
}

async function getMyReports(reported_by_user_id) {
  const result = await pool.query(
    `SELECT
        report_id,
        reported_by_user_id,
        reported_user_id,
        ride_offer_id,
        ride_request_id,
        message_id,
        reason,
        details,
        status,
        created_at,
        updated_at
    FROM reports
    WHERE reported_by_user_id = $1
    ORDER BY created_at DESC`,
    [reported_by_user_id],
  );
  return result.rows;
}

async function getAllReportsForAdmin() {
  const result = await pool.query(
    `SELECT
        report_id,
        reported_by_user_id,
        reported_user_id,
        ride_offer_id,
        ride_request_id,
        message_id,
        reason,
        details,
        status,
        created_at,
        updated_at
    FROM reports
    ORDER BY created_at DESC`,
  );
  return result.rows;
}

module.exports = {
  createReport,
  findUserById,
  findRideOfferById,
  findRideRequestById,
  findMessageById,
  findReportById,
  getMyReports,
  getAllReportsForAdmin,
};
