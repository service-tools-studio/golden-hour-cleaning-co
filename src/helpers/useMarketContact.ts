"use client";

import type { MarketContact, MarketId } from "@/lib/markets";
import { useActiveMarket } from "@/helpers/useActiveMarket";

/** Call/text numbers — prefers `ghc_preferred_market`, then URL, then page market. */
export function useMarketContact(pageMarketId?: MarketId): MarketContact {
  return useActiveMarket(pageMarketId).contact;
}
