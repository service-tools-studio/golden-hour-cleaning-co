"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useMarketSearchParam } from "@/helpers/useMarketSearchParam";
import {
  getPreferredMarketSnapshot,
  resolveServicesHubHref,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

/** Services & Pricing nav href — respects `ghc_preferred_market`, then `/phoenix` routes. */
export function useServicesHubHref(): string {
  const pathname = usePathname();
  const marketQueryParam = useMarketSearchParam();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  return resolveServicesHubHref({
    marketQueryParam,
    pathname,
    preferredMarket,
  });
}
