import type { Metadata } from "next";
import PortlandMoveOutCleaningClient from "@/components/ppc/PortlandMoveOutCleaningClient";
import { getGooglePlaceSummary } from "@/lib/googlePlaceSummaryServer";
import { MARKETS } from "@/lib/markets";

const ppc = MARKETS.portland.ppcLandings.moveOut;

export const metadata: Metadata = {
  title: ppc.seoTitle,
  description: ppc.seoDescription,
  alternates: { canonical: ppc.path },
};

export default async function PortlandMoveOutCleaningPage() {
  const { rating, reviewCount } = await getGooglePlaceSummary();

  return (
    <PortlandMoveOutCleaningClient
      initialRating={rating}
      initialReviewCount={reviewCount}
    />
  );
}
