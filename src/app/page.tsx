import type { Metadata } from "next";
import MarketingLandingPage from "@/components/MarketingLandingPage";
import { resolveMarketIdForHomePage } from "@/lib/marketPreference";
import { MARKETS, buildMarketMetadata } from "@/lib/markets";

export const metadata: Metadata = buildMarketMetadata(MARKETS.portland);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }> | { market?: string };
}) {
  const sp = "then" in searchParams ? await searchParams : searchParams;
  const marketId = resolveMarketIdForHomePage(sp?.market);

  return <MarketingLandingPage marketId={marketId} pagePath="/" />;
}