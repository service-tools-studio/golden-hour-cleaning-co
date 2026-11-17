"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getMarketIdFromPath, type MarketId } from "@/lib/markets";
import {
  isMarketQueryParamPath,
  resolveLeadFunnelMarketPreference,
} from "@/lib/marketPreference";
import { usePersistPreferredMarket } from "@/helpers/usePersistPreferredMarket";

function resolveMarketToPersist(
  pathname: string | null,
  marketParam: string | null,
): MarketId | null {
  if (!pathname) return null;
  if (isMarketQueryParamPath(pathname)) {
    return resolveLeadFunnelMarketPreference(marketParam);
  }
  return getMarketIdFromPath(pathname);
}

/**
 * Persists market choice from URL path (e.g. `/phoenix`) or lead funnels
 * (`/reviews?market=phoenix`, `/book-online`, `/request-a-quote` — no param → Portland).
 */
export default function MarketPreferenceFromPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const marketParam = searchParams.get("market");
  const marketId = resolveMarketToPersist(pathname, marketParam);
  usePersistPreferredMarket(marketId);
  return null;
}