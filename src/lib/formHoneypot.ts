/**
 * Hidden field name — obscure on purpose so browsers/extensions don't autofill it.
 * Must stay out of visible UI; bots often fill every input they find.
 */
export const HONEYPOT_FIELD = "ghc_hp_a9";

export function isHoneypotTripped(value: unknown): boolean {
  if (value == null) return false;
  return String(value).trim().length > 0;
}