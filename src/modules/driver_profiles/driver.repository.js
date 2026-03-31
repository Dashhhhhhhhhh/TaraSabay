const pool = require("../../config/db");

async function findUserById(user_id) {
  const result = await pool.query(
    `SELECT u.user_id
        FROM users u
        WHERE u.user_id = $1`,
    [user_id],
  );
  return result.rows[0];
}

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

async function findDriverProfileWithUserInfoByUserId(user_id) {
  const result = await pool.query(
    `SELECT
        d.driver_profile_id,
        d.user_id,
        d.vehicle_type,
        d.seat_capacity,
        d.created_at,
        d.updated_at,
        u.first_name || ' ' || u.last_name AS user_full_name,
        u.display_name
     FROM driver_profiles d
     LEFT JOIN users u
       ON d.user_id = u.user_id
     WHERE d.user_id = $1`,
    [user_id],
  );
  return result.rows[0];
}

async function findDriverProfileById(driver_profile_id) {
  const result = await pool.query(
    `SELECT 
            driver_profile_id,
            user_id,
            vehicle_type,
            seat_capacity,
            created_at,
            updated_at
        FROM driver_profiles
        WHERE driver_profile_id = $1`,
    [driver_profile_id],
  );
  return result.rows[0];
}
async function createDriverProfile(driverData) {
  const result = await pool.query(
    `INSERT INTO driver_profiles
            (
            user_id,
            vehicle_type,
            seat_capacity
            )
        VALUES
            ($1, $2, $3)
        RETURNING
            driver_profile_id,
            user_id,
            vehicle_type,
            seat_capacity,
            created_at,
            updated_at`,
    [driverData.user_id, driverData.vehicle_type, driverData.seat_capacity],
  );
  return result.rows[0];
}

async function updateDriverProfile(driver_profile_id, updatedData) {
  const result = await pool.query(
    `
        UPDATE driver_profiles
        SET
            vehicle_type = $1,
            seat_capacity = $2
        WHERE
            driver_profile_id = $3
        RETURNING *;
        `,
    [updatedData.vehicle_type, updatedData.seat_capacity, driver_profile_id],
  );
  return result.rows[0];
}

module.exports = {
  findDriverProfileByUserId,
  findUserById,
  createDriverProfile,
  findDriverProfileWithUserInfoByUserId,
  findDriverProfileById,
  updateDriverProfile,
};
