/** Hidden field name — must stay out of visible UI; bots often fill it. */
export const HONEYPOT_FIELD = "companyWebsite";

export function isHoneypotTripped(value: unknown): boolean {
  if (value == null) return false;
  return String(value).trim().length > 0;
}