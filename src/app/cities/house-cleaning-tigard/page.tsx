import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningTigardClient from "./HouseCleaningTigardClient";

export const metadata: Metadata = {
  title: "House Cleaning Tigard, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Tigard, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
};

export default async function HouseCleaningTigardPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningTigardClient googleReviews={googleReviews} />;
}
