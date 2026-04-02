function cleanName(str) {
  return str ? str.trim().replace(/\s+/g, " ") : null;
}

function cleanString(str) {
  if (!str) return null;
  const normalized = str.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeMiddleInitial(str) {
  if (!str) return null;
  const cleaned = str.trim();
  return cleaned.length > 0 ? cleaned[0].toUpperCase() : null;
}

function normalizeEmail(str) {
  return str.trim().toLowerCase();
}

function validateContactNumber(number) {
  if (!number) return null;

  let cleaned = number.trim().replace(/[\s\-()]/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    cleaned = "+63" + cleaned.slice(1);
  }
  const regex = /^\+639\d{9}$/;
  return regex.test(cleaned);
}

function cleanRoleName(role) {
  const normalized = role.trim().replace(/\s+/g, " ");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function isInteger(value) {
  return Number.isInteger(Number(value));
}

module.exports = {
  cleanName,
  cleanString,
  normalizeEmail,
  normalizeMiddleInitial,
  validateContactNumber,
  cleanRoleName,
  isInteger,
};
