"use client";

import { usePathname } from "next/navigation";
import { getMarketIdFromPath } from "@/lib/markets";
import { usePersistPreferredMarket } from "@/helpers/usePersistPreferredMarket";

/**
 * Treat visiting `/phoenix` (or Portland home / city / hub paths) as an explicit
 * market choice — same storage key as the header location selector.
 */
export default function MarketPreferenceFromPath() {
  const pathname = usePathname();
  const marketId = pathname ? getMarketIdFromPath(pathname) : null;
  usePersistPreferredMarket(marketId);
  return null;
}
