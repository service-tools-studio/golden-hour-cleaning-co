import type { Metadata } from "next";
import PpcMoveOutCleaningClient from "@/components/ppc/PpcMoveOutCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.phoenix.ppcLandings.moveOut;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PhoenixMoveOutCleaningPage() {
  const [{ rating, reviewCount }, googleReviews] = await Promise.all([
    getGooglePlaceSummary(),
    getGoogleReviews(),
  ]);

  return (
    <PpcMoveOutCleaningClient
      market={MARKETS.phoenix}
      initialRating={rating}
      initialReviewCount={reviewCount}
      googleReviews={googleReviews}
    />
  );
}
