"use client";

import type { MarketId } from "@/lib/markets";
import { useActiveMarket } from "@/helpers/useActiveMarket";
import { withMarketQueryForNeutralPath } from "@/lib/marketPreference";

/** Services hub, about, commercial, and home — honors `?market=` + stored preference. */
export function useMarketPaths(pageMarketId?: MarketId) {
  const market = useActiveMarket(pageMarketId);
  return {
    market,
    servicesHubPath: market.servicesHubPath,
    aboutPath: market.aboutPath,
    commercialPath: market.commercialPath,
    homePath: market.path,
    /** Portland `/residential/quote` vs Phoenix home pricing section */
    pricingEntryHref:
      market.id === "phoenix" ? "/phoenix#quote" : "/residential/quote",
    bookOnlineHref: withMarketQueryForNeutralPath("/book-online", market.id),
    requestQuoteHref: withMarketQueryForNeutralPath(
      "/request-a-quote",
      market.id,
    ),
    reviewsHref: withMarketQueryForNeutralPath("/reviews", market.id),
    satisfactionGuaranteeHref: withMarketQueryForNeutralPath(
      "/satisfaction-guarantee",
      market.id,
    ),
    contactHref: withMarketQueryForNeutralPath("/contact", market.id),
  };
}