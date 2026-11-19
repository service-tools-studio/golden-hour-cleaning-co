import type { MarketId } from "@/lib/markets";
import { MARKETS, getMarketIdFromPath } from "@/lib/markets";
import {
  MARKET_PREFERENCE_STORAGE_KEY,
  PREFERRED_MARKET_CHANGE_EVENT,
  marketIdFromQueryParam,
  readPreferredMarketFromStorage,
} from "@/lib/marketPreference";

type MarketResolutionInput = {
  marketQueryParam?: string | null;
  preferredMarket?: MarketId | null;
  pathname?: string | null;
  pageMarketId?: MarketId;
};

/** Active market for UI: `?market=` → canonical homes (`/` Portland, `/phoenix…`) → storage → path → page hint → Portland. */
export function resolveMarketIdFromContext(
  options: MarketResolutionInput,
): MarketId {
  const fromQuery = marketIdFromQueryParam(options.marketQueryParam);
  if (fromQuery) return fromQuery;

  const pathname = options.pathname ?? "";
  if (pathname === "/" || pathname === "") {
    return "portland";
  }
  if (pathname.startsWith("/phoenix")) {
    return "phoenix";
  }

  if (options.preferredMarket) return options.preferredMarket;
  const fromPath = getMarketIdFromPath(pathname);
  if (fromPath) return fromPath;
  if (options.pageMarketId) return options.pageMarketId;
  return "portland";
}

export function servicesHubPathForMarket(marketId: MarketId): string {
  return MARKETS[marketId].servicesHubPath;
}

export function aboutPathForMarket(marketId: MarketId): string {
  return MARKETS[marketId].aboutPath;
}

export function commercialPathForMarket(marketId: MarketId): string {
  return MARKETS[marketId].commercialPath;
}

/** Rewrite Portland marketing paths when the active market is Phoenix. */
export function resolveMarketingHrefForMarket(
  href: string,
  marketId: MarketId,
): string {
  if (marketId === "portland") return href;

  if (href === "/residential/quote") {
    return `${MARKETS.phoenix.path}#quote`;
  }
  if (href.startsWith("/residential/services")) {
    return href.replace("/residential/services", MARKETS.phoenix.servicesHubPath);
  }
  if (href === "/about") return MARKETS.phoenix.aboutPath;
  if (href === "/commercial") return MARKETS.phoenix.commercialPath;

  return href;
}

export function resolveMarketAboutHref(options: MarketResolutionInput): string {
  return aboutPathForMarket(resolveMarketIdFromContext(options));
}

export function resolveMarketHomeHref(
  options: MarketResolutionInput,
): "/" | "/phoenix" {
  return MARKETS[resolveMarketIdFromContext(options)].path;
}

/**
 * Pick the services hub URL from explicit preference, current path, or Portland default.
 * Explicit URLs are not overridden — this only picks which hub to link to in nav.
 */
export function resolveServicesHubHref(options: MarketResolutionInput): string {
  return servicesHubPathForMarket(resolveMarketIdFromContext(options));
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

/** Preference → URL market → page default → Portland (plus `?market=` when set). */
export function resolveActiveMarketId(options: MarketResolutionInput): MarketId {
  return resolveMarketIdFromContext(options);
}
