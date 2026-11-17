"use client";

import { useSearchParams } from "next/navigation";

/** Raw `market` query value from the current URL (any page). */
export function useMarketSearchParam(): string | null {
  const searchParams = useSearchParams();
  return searchParams.get("market");
}