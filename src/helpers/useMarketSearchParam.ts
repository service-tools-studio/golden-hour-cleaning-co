"use client";

import { useMarketQueryParamFromContext } from "@/components/markets/MarketQueryParamProvider";

/** Raw `market` query value from the current URL (any page). */
export function useMarketSearchParam(): string | null {
  return useMarketQueryParamFromContext();
}