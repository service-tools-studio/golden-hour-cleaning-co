import type { MarketId } from "@/lib/markets";
import { MARKETS, getMarketIdFromPath } from "@/lib/markets";
import {
  MARKET_PREFERENCE_STORAGE_KEY,
  PREFERRED_MARKET_CHANGE_EVENT,
  readPreferredMarketFromStorage,
} from "@/lib/marketPreference";

export function servicesHubPathForMarket(marketId: MarketId): string {
  return MARKETS[marketId].servicesHubPath;
}

export function aboutPathForMarket(marketId: MarketId): string {
  return MARKETS[marketId].aboutPath;
}

export function resolveMarketAboutHref(options: {
  pathname?: string | null;
  preferredMarket?: MarketId | null;
}): string {
  if (options.preferredMarket) {
    return aboutPathForMarket(options.preferredMarket);
  }
  const fromPath = options.pathname
    ? getMarketIdFromPath(options.pathname)
    : null;
  if (fromPath === "phoenix") {
    return aboutPathForMarket("phoenix");
  }
  return aboutPathForMarket("portland");
}

export function resolveMarketHomeHref(options: {
  pathname?: string | null;
  preferredMarket?: MarketId | null;
  /** Market for the current page when no preference is stored */
  pageMarketId?: MarketId;
}): "/" | "/phoenix" {
  if (options.preferredMarket) {
    return MARKETS[options.preferredMarket].path;
  }
  if (options.pageMarketId) {
    return MARKETS[options.pageMarketId].path;
  }
  const fromPath = options.pathname
    ? getMarketIdFromPath(options.pathname)
    : null;
  if (fromPath === "phoenix") {
    return MARKETS.phoenix.path;
  }
  return MARKETS.portland.path;
}

/**
 * Pick the services hub URL from explicit preference, current path, or Portland default.
 * Explicit URLs are not overridden — this only picks which hub to link to in nav.
 */
export function resolveServicesHubHref(options: {
  pathname?: string | null;
  preferredMarket?: MarketId | null;
}): string {
  if (options.preferredMarket) {
    return servicesHubPathForMarket(options.preferredMarket);
  }

  const fromPath = options.pathname
    ? getMarketIdFromPath(options.pathname)
    : null;
  if (fromPath === "phoenix") {
    return servicesHubPathForMarket("phoenix");
  }

  return servicesHubPathForMarket("portland");
}

export function subscribeToPreferredMarket(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === MARKET_PREFERENCE_STORAGE_KEY) onStoreChange();
  };
  const onPreferredChange = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(PREFERRED_MARKET_CHANGE_EVENT, onPreferredChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PREFERRED_MARKET_CHANGE_EVENT, onPreferredChange);
  };
}

export function getPreferredMarketSnapshot(): MarketId | null {
  return readPreferredMarketFromStorage();
}

/** Preference → URL market → page default → Portland. */
export function resolveActiveMarketId(options: {
  preferredMarket?: MarketId | null;
  pathname?: string | null;
  pageMarketId?: MarketId;
}): MarketId {
  if (options.preferredMarket) return options.preferredMarket;
  const fromPath = options.pathname
    ? getMarketIdFromPath(options.pathname)
    : null;
  if (fromPath) return fromPath;
  if (options.pageMarketId) return options.pageMarketId;
  return "portland";
}
