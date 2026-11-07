"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getPreferredMarketSnapshot,
  resolveActiveMarketId,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";
import { MARKETS, type MarketConfig, type MarketId } from "@/lib/markets";

/** Footer, contact, etc. — honors `ghc_preferred_market`, then URL, then page hint. */
export function useActiveMarket(pageMarketId?: MarketId): MarketConfig {
  const pathname = usePathname();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  const marketId = resolveActiveMarketId({
    preferredMarket,
    pathname,
    pageMarketId,
  });

  return MARKETS[marketId];
}
