import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningBeavertonClient from "./HouseCleaningBeavertonClient";

export const metadata: Metadata = {
  title: "House Cleaning Beaverton, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Beaverton, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
};

export default async function HouseCleaningBeavertonPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningBeavertonClient googleReviews={googleReviews} />;
}
