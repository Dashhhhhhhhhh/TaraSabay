export function validateContactNumber(number) {
  if (!number) return null;

  let cleaned = number.trim().replace(/[\s\-()]/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    cleaned = "+63" + cleaned.slice(1);
  }
  const regex = /^\+639\d{9}$/;
  return regex.test(cleaned);
}
