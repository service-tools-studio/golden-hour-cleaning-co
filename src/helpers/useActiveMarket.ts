"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useMarketSearchParam } from "@/helpers/useMarketSearchParam";
import {
  getPreferredMarketSnapshot,
  resolveActiveMarketId,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";
import { MARKETS, type MarketConfig, type MarketId } from "@/lib/markets";

/** Footer, contact, etc. — `?market=`, then `ghc_preferred_market`, then URL path, then page hint. */
export function useActiveMarket(pageMarketId?: MarketId): MarketConfig {
  const pathname = usePathname();
  const marketQueryParam = useMarketSearchParam();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  const marketId = resolveActiveMarketId({
    marketQueryParam,
    preferredMarket,
    pathname,
    pageMarketId,
  });

  return MARKETS[marketId];
}
