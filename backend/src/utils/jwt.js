const jwt = require("jsonwebtoken");

function generateToken({ user_id, email, role }) {
  return jwt.sign({ user_id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

module.exports = { generateToken };
