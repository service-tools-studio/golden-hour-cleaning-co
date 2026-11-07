"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getPreferredMarketSnapshot,
  resolveMarketAboutHref,
  subscribeToPreferredMarket,
} from "@/lib/marketNavigation";

export function useMarketAboutHref(): string {
  const pathname = usePathname();
  const preferredMarket = useSyncExternalStore(
    subscribeToPreferredMarket,
    getPreferredMarketSnapshot,
    () => null,
  );

  return resolveMarketAboutHref({ pathname, preferredMarket });
}
