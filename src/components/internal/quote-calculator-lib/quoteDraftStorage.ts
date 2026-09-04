/** Isolated session draft for /internal/quote-calculator only. */

const QUOTE_DRAFT_KEY = "ghc_quote_draft_internal";

export type InternalQuoteDraft = {
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  cleanType?: string;
  includeFridge?: boolean;
  includeOven?: boolean;
  includeSecondKitchen?: boolean;
  promoCode?: string;
  calendlyOpen?: boolean;
};

export function readQuoteDraft(): InternalQuoteDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUOTE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InternalQuoteDraft;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeQuoteDraft(partial: InternalQuoteDraft) {
  if (typeof window === "undefined") return;
  try {
    const current = readQuoteDraft() || {};
    sessionStorage.setItem(
      QUOTE_DRAFT_KEY,
      JSON.stringify({ ...current, ...partial })
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

export function asFiniteNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
