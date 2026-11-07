import type { Metadata } from "next";
import MarketingLandingPage from "@/components/MarketingLandingPage";
import { MARKETS, buildMarketMetadata } from "@/lib/markets";

export const metadata: Metadata = buildMarketMetadata(MARKETS.portland);

export default function HomePage() {
  return <MarketingLandingPage marketId="portland" />;
}
