export function formatCurrency(n) {
  return `$${(Math.max(0, Math.round(n))).toLocaleString()}`;
}

export function buildSmsLink({ phone, message }) {
  // iOS/Android compatible scheme
  const body = encodeURIComponent(message);
  return `sms:${phone}?&body=${body}`;
}

export function buildMailto({ email, subject, body }) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatPhone(e164) {
  const m = (e164 || "").replace(/[^\d]/g, "").match(/^1?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164;
}

/** Progressive US phone formatting for text inputs: (503) 555-1234 */
export function formatPhoneInput(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .replace(/^1(?=\d{10})/, "")
    .slice(0, 10);

  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
