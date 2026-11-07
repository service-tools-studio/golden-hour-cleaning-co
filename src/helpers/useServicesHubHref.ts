"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getPreferredMarketSnapshot,
  resolveServicesHubHref,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

/** Services & Pricing nav href — respects `ghc_preferred_market`, then `/phoenix` routes. */
export function useServicesHubHref(): string {
  const pathname = usePathname();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  return resolveServicesHubHref({ pathname, preferredMarket });
}
