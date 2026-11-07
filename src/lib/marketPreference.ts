import type { MarketId } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";

export const MARKET_PREFERENCE_STORAGE_KEY = "ghc_preferred_market";

/** Same name as localStorage — used for `/residential` → market home redirects. */
export const MARKET_PREFERENCE_COOKIE = MARKET_PREFERENCE_STORAGE_KEY;

const MARKET_PREFERENCE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function resolveResidentialLegacyHomeRedirect(
  preferredMarket: MarketId | null,
): "/" | "/phoenix" {
  if (preferredMarket === "phoenix") return MARKETS.phoenix.path;
  return MARKETS.portland.path;
}

export function isMarketId(value: string | null | undefined): value is MarketId {
  return value === "portland" || value === "phoenix";
}

export function readPreferredMarketFromStorage(): MarketId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MARKET_PREFERENCE_STORAGE_KEY);
    return isMarketId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export const PREFERRED_MARKET_CHANGE_EVENT = "ghc-preferred-market-change";

export function writePreferredMarketCookie(market: MarketId): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${MARKET_PREFERENCE_COOKIE}=${market}; Path=/; Max-Age=${MARKET_PREFERENCE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function syncPreferredMarketCookieFromStorage(): void {
  const stored = readPreferredMarketFromStorage();
  if (stored) writePreferredMarketCookie(stored);
}

export function writePreferredMarketToStorage(market: MarketId): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MARKET_PREFERENCE_STORAGE_KEY, market);
    writePreferredMarketCookie(market);
    window.dispatchEvent(new Event(PREFERRED_MARKET_CHANGE_EVENT));
  } catch {
    /* quota / private mode */
  }
}

export function readPreferredMarketFromCookies(
  getCookie: (name: string) => string | undefined,
): MarketId | null {
  const raw = getCookie(MARKET_PREFERENCE_COOKIE);
  return isMarketId(raw) ? raw : null;
}

/** Dismissed Arizona→Portland suggestion banner */
export const MARKET_GEO_SUGGEST_DISMISS_KEY = "ghc_dismiss_phx_suggestion";

export function readGeoSuggestionDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MARKET_GEO_SUGGEST_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGeoSuggestionDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MARKET_GEO_SUGGEST_DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}
