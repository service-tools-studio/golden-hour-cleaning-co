import type { Metadata } from "next";
import CommercialMarketingPage from "@/components/commercial/CommercialMarketingPage";
import { MARKETS } from "@/lib/markets";

const commercial = MARKETS.portland.commercial;

export const metadata: Metadata = {
  title: commercial.seoTitle,
  description: commercial.seoDescription,
  alternates: { canonical: MARKETS.portland.commercialPath },
};

export default function CommercialPage() {
  return (
    <CommercialMarketingPage
      market={MARKETS.portland}
      scrollPagePath="/commercial"
    />
  );
}
