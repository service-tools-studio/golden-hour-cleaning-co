import type { Metadata } from "next";
import PpcDeepCleaningClient from "@/components/ppc/PpcDeepCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.phoenix.ppcLandings.deepCleaning;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PhoenixDeepCleaningPage() {
  const [{ rating, reviewCount }, googleReviews] = await Promise.all([
    getGooglePlaceSummary(),
    getGoogleReviews(),
  ]);

  return (
    <PpcDeepCleaningClient
      market={MARKETS.phoenix}
      initialRating={rating}
      initialReviewCount={reviewCount}
      googleReviews={googleReviews}
    />
  );
}
