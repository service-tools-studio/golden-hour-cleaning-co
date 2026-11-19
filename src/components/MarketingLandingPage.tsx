import { headers } from "next/headers";
import MarketingLandingClient from "@/components/MarketingLandingClient";
import { getMarketById, type MarketId } from "@/lib/markets";

type Props = {
  marketId: MarketId;
  /** Analytics path — defaults to the market’s canonical home (`/` or `/phoenix`). */
  pagePath?: "/" | "/phoenix";
};

export default async function MarketingLandingPage({
  marketId,
  pagePath,
}: Props) {
  const headerList = await headers();
  const visitorRegion =
    headerList.get("x-geo-region") ??
    headerList.get("x-vercel-ip-country-region");
  const market = getMarketById(marketId);

  return (
    <MarketingLandingClient
      market={market}
      pagePath={pagePath ?? market.path}
      visitorRegion={visitorRegion}
    />
  );
}
