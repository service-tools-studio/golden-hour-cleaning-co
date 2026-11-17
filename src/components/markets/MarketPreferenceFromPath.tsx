"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { resolveMarketPreferenceToPersist } from "@/lib/marketPreference";
import { usePersistPreferredMarket } from "@/helpers/usePersistPreferredMarket";

/**
 * Saves `ghc_preferred_market` from `?market=` on any URL (sticky site-wide),
 * or from `/` / `/phoenix…` without a query param.
 */
export default function MarketPreferenceFromPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const marketId = resolveMarketPreferenceToPersist(
    pathname,
    searchParams.get("market"),
  );
  usePersistPreferredMarket(marketId);
  return null;
}