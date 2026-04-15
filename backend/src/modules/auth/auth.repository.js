const pool = require("../../config/db");

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT
        user_id,
        email
     FROM users
     WHERE email = $1`,
    [email],
  );
  return result.rows[0];
}

async function findRoleByName(role_name) {
  const result = await pool.query(
    `SELECT
        role_id,
        role_name
     FROM roles
     WHERE role_name = $1`,
    [role_name],
  );
  return result.rows[0];
}

async function createUser(userData) {
  const result = await pool.query(
    `INSERT INTO users
        (
        role_id,
        first_name,
        middle_initial,
        last_name,
        email,
        password_hash,
        contact_number
        )
     VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
     RETURNING 
        user_id,
        role_id,
        first_name,
        middle_initial,
        last_name,
        email,
        contact_number,
        is_active,
        created_at,
        updated_at`,
    [
      userData.role_id,
      userData.first_name,
      userData.middle_initial,
      userData.last_name,
      userData.email,
      userData.password_hash,
      userData.contact_number,
    ],
  );
  return result.rows[0];
}

async function findUserAuthByEmail(email) {
  const result = await pool.query(
    `SELECT  
            u.user_id,
            u.first_name,
            u.middle_initial,
            u.last_name,
            u.email,
            u.password_hash,
            u.is_active,
            r.role_name AS role
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1`,
    [email],
  );
  return result.rows[0];
}

async function findUserProfileById(user_id) {
  const result = await pool.query(
    `SELECT
        u.user_id,
        u.first_name,
        u.middle_initial,
        u.last_name,
        u.email,
        u.is_active,
        r.role_name AS role
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = $1`,
    [user_id],
  );
  return result.rows[0];
}
module.exports = {
  findUserByEmail,
  findRoleByName,
  createUser,
  findUserAuthByEmail,
  findUserProfileById,
};
