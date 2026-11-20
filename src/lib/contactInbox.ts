/** Default inbox when env overrides are unset — same as residential quote / book-online. */

/**
 * Delivery address for all website form emails (quote, booking, contact, commercial).
 * SMTP auth is always `GMAIL_USER` + `GMAIL_APP_PASSWORD` — no separate app password.
 */
export function getContactInboxEmail(): string {
  return (
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.COMMERCIAL_QUOTE_TO?.trim() ||
    process.env.GMAIL_USER?.trim() || ""
  );
}