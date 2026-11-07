import type { Metadata } from "next";
import CommercialMarketingPage from "@/components/commercial/CommercialMarketingPage";
import { MARKETS } from "@/lib/markets";

const commercial = MARKETS.phoenix.commercial;

export const metadata: Metadata = {
  title: commercial.seoTitle,
  description: commercial.seoDescription,
  alternates: { canonical: MARKETS.phoenix.commercialPath },
};

export default function PhoenixCommercialPage() {
  return (
    <CommercialMarketingPage
      market={MARKETS.phoenix}
      scrollPagePath="/phoenix/commercial"
    />
  );
}
