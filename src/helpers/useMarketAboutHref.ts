"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useMarketSearchParam } from "@/helpers/useMarketSearchParam";
import {
  getPreferredMarketSnapshot,
  resolveMarketAboutHref,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

export function useMarketAboutHref(): string {
  const pathname = usePathname();
  const marketQueryParam = useMarketSearchParam();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  return resolveMarketAboutHref({
    marketQueryParam,
    pathname,
    preferredMarket,
  });
}
