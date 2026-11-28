import type { Metadata } from "next";
import PortlandMoveOutCleaningClient from "@/components/ppc/PortlandMoveOutCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.portland.ppcLandings.moveOut;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PortlandMoveOutCleaningPage() {
  const [{ rating, reviewCount }, googleReviews] = await Promise.all([
    getGooglePlaceSummary(),
    getGoogleReviews(),
  ]);

  return (
    <PortlandMoveOutCleaningClient
      initialRating={rating}
      initialReviewCount={reviewCount}
      googleReviews={googleReviews}
    />
  );
}
