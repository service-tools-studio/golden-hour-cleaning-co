"use client";

import { useEffect } from "react";
import type { MarketId } from "@/lib/markets";
import { writePreferredMarketToStorage } from "@/lib/marketPreference";

/** Writes `ghc_preferred_market` when the user is on a market-specific URL or picker. */
export function usePersistPreferredMarket(marketId: MarketId | null) {
  useEffect(() => {
    if (marketId) writePreferredMarketToStorage(marketId);
  }, [marketId]);
}
