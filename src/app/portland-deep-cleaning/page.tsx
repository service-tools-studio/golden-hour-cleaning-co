import type { Metadata } from "next";
import PortlandDeepCleaningClient from "@/components/ppc/PortlandDeepCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.portland.ppcLandings.deepCleaning;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PortlandDeepCleaningPage() {
  const { rating, reviewCount } = await getGooglePlaceSummary();

  return (
    <PortlandDeepCleaningClient
      initialRating={rating}
      initialReviewCount={reviewCount}
    />
  );
}
