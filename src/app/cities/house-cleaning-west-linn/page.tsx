import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningWestLinnClient from "./HouseCleaningWestLinnClient";

export const metadata: Metadata = {
  title: "House Cleaning West Linn, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in West Linn, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
};

export default async function HouseCleaningWestLinnPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningWestLinnClient googleReviews={googleReviews} />;
}
