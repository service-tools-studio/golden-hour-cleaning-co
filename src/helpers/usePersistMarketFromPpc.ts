"use client";

import { useEffect } from "react";
import type { MarketId } from "@/lib/markets";
import { writePreferredMarketToStorage } from "@/lib/marketPreference";

/** Treat PPC landings as an explicit market choice (Portland or Phoenix). */
export function usePersistMarketFromPpc(marketId: MarketId) {
  useEffect(() => {
    writePreferredMarketToStorage(marketId);
  }, [marketId]);
}
