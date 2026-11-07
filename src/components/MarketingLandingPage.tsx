import { headers } from "next/headers";
import MarketingLandingClient from "@/components/MarketingLandingClient";
import { getMarketById, type MarketId } from "@/lib/markets";

type Props = {
  marketId: MarketId;
};

export default async function MarketingLandingPage({ marketId }: Props) {
  const headerList = await headers();
  const visitorRegion =
    headerList.get("x-geo-region") ??
    headerList.get("x-vercel-ip-country-region");
  const market = getMarketById(marketId);

  return (
    <MarketingLandingClient
      market={market}
      pagePath={market.path}
      visitorRegion={visitorRegion}
    />
  );
}
