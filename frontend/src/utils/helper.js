export function validateContactNumber(number) {
  if (!number) return null;

  let cleaned = number.trim().replace(/[\s\-()]/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    cleaned = "+63" + cleaned.slice(1);
  }
  const regex = /^\+639\d{9}$/;
  return regex.test(cleaned);
}

export function cleanName(str) {
  if (str == null) return null;
  const cleaned = str.trim().replace(/\s+/g, " ");
  return cleaned;
}

export function cleanString(str) {
  if (!str) return null;
  const normalized = str.trim();
  return normalized.length > 0 ? normalized : null;
}

export function toDatetimeLocal(isoString) {
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
  return localISOTime;
}
