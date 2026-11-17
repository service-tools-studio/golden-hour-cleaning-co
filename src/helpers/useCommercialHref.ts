"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { MarketId } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";
import { useMarketSearchParam } from "@/helpers/useMarketSearchParam";
import {
  getPreferredMarketSnapshot,
  resolveActiveMarketId,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

/** Commercial landing — prefers `ghc_preferred_market`, else the page’s market. */
export function useCommercialHref(pageMarketId: MarketId): string {
  const pathname = usePathname();
  const marketQueryParam = useMarketSearchParam();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );
  const marketId = resolveActiveMarketId({
    marketQueryParam,
    pathname,
    preferredMarket,
    pageMarketId,
  });
  return MARKETS[marketId].commercialPath;
}
