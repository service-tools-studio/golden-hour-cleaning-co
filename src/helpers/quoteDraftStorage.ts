const QUOTE_DRAFT_KEY = "ghc_quote_draft";

export type QuoteDraft = {
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

export function readQuoteDraft(): QuoteDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUOTE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuoteDraft;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeQuoteDraft(partial: QuoteDraft) {
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
