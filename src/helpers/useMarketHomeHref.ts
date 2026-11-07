"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { MarketId } from "@/lib/markets";
import {
  getPreferredMarketSnapshot,
  resolveMarketHomeHref,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

/** Logo / market home — prefers `ghc_preferred_market`, then the page’s market. */
export function useMarketHomeHref(pageMarketId: MarketId): "/" | "/phoenix" {
  const pathname = usePathname();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  return resolveMarketHomeHref({
    pathname,
    preferredMarket,
    pageMarketId,
  });
}
