import { MARKETS, buildMarketMetadata } from "@/lib/markets";
import MarketingLandingPage from "@/components/MarketingLandingPage";

export const metadata = buildMarketMetadata(MARKETS.phoenix);

export default function PhoenixHomePage() {
  return <MarketingLandingPage marketId="phoenix" />;
}
