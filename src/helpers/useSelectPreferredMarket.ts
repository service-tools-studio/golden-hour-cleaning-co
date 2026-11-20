"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useActiveMarket } from "@/helpers/useActiveMarket";
import { useMarketSearchParam } from "@/helpers/useMarketSearchParam";
import type { MarketConfig, MarketId } from "@/lib/markets";
import {
  marketIdFromQueryParam,
  writePreferredMarketToStorage,
} from "@/lib/marketPreference";

/** Canonical home paths fix market in `resolveMarketIdFromContext` before storage. */
export function marketIdForcedByPath(pathname: string): MarketId | null {
  if (pathname === "/" || pathname === "") return "portland";
  if (pathname.startsWith("/phoenix")) return "phoenix";
  return null;
}

type Result = {
  market: MarketConfig;
  selectMarket: (id: MarketId) => void;
};

/**
 * Inline location picker — updates storage and re-renders market-aware UI without
 * navigating to another route. Adjusts `?market=` on the current URL only when the
 * path would otherwise override the chosen preference (e.g. `/` vs `/phoenix`).
 */
export function useSelectPreferredMarket(pageMarketId?: MarketId): Result {
  const market = useActiveMarket(pageMarketId);
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const marketQueryParam = useMarketSearchParam();

  const selectMarket = useCallback(
    (id: MarketId) => {
      writePreferredMarketToStorage(id);

      const forced = marketIdForcedByPath(pathname);
      const hasMarketQuery = Boolean(marketIdFromQueryParam(marketQueryParam));
      const pathConflicts = forced !== null && forced !== id;

      if (!pathConflicts && !(id === "portland" && hasMarketQuery)) {
        return;
      }

      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search.slice(1) : "",
      );

      if (id === "portland") {
        params.delete("market");
      } else {
        params.set("market", id);
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [marketQueryParam, pathname, router],
  );

  return { market, selectMarket };
}