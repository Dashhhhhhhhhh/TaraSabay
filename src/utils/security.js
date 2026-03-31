const { validate } = require("uuid");

const bcrypt = require("bcrypt");
const saltRounds = 10;

function isValidUUID(id) {
  return validate(id);
}

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = { isValidUUID, hashPassword, comparePassword };
