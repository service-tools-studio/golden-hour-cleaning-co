"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getMarketIdFromPath, type MarketId } from "@/lib/markets";
import {
  isLeadFunnelMarketPath,
  resolveLeadFunnelMarketPreference,
} from "@/lib/marketPreference";
import { usePersistPreferredMarket } from "@/helpers/usePersistPreferredMarket";

function resolveMarketToPersist(
  pathname: string | null,
  marketParam: string | null,
): MarketId | null {
  if (!pathname) return null;
  if (isLeadFunnelMarketPath(pathname)) {
    return resolveLeadFunnelMarketPreference(marketParam);
  }
  return getMarketIdFromPath(pathname);
}

/**
 * Persists market choice from URL path (e.g. `/phoenix`) or lead funnels
 * (`/book-online?market=phoenix` → Phoenix; no param → Portland).
 */
export default function MarketPreferenceFromPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const marketParam = searchParams.get("market");
  const marketId = resolveMarketToPersist(pathname, marketParam);
  usePersistPreferredMarket(marketId);
  return null;
}