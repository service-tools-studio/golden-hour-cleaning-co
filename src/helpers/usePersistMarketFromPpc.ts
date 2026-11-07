"use client";

import type { MarketId } from "@/lib/markets";
import { usePersistPreferredMarket } from "@/helpers/usePersistPreferredMarket";

/** Treat PPC landings as an explicit market choice (Portland or Phoenix). */
export function usePersistMarketFromPpc(marketId: MarketId) {
  usePersistPreferredMarket(marketId);
}
