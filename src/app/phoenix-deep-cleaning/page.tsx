import type { Metadata } from "next";
import PpcDeepCleaningClient from "@/components/ppc/PpcDeepCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.phoenix.ppcLandings.deepCleaning;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PhoenixDeepCleaningPage() {
  const { rating, reviewCount } = await getGooglePlaceSummary();

  return (
    <PpcDeepCleaningClient
      market={MARKETS.phoenix}
      initialRating={rating}
      initialReviewCount={reviewCount}
    />
  );
}
