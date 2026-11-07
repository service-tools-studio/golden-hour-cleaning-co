"use client";

import { useSyncExternalStore } from "react";
import type { MarketId } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";
import {
  getPreferredMarketSnapshot,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

/** Commercial landing — prefers `ghc_preferred_market`, else the page’s market. */
export function useCommercialHref(pageMarketId: MarketId): string {
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );
  const marketId = preferredMarket ?? pageMarketId;
  return MARKETS[marketId].commercialPath;
}
