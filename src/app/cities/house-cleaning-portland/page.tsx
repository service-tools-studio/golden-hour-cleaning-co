import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningPortlandClient from "./HouseCleaningPortlandClient";

export const metadata: Metadata = {
  title: "House Cleaning Portland, OR | Golden Hour Cleaning Co.",
  description:
    "Professional house cleaning in Portland, OR — recurring, deep, and move-out cleaning with personalized quotes and thoughtful, reliable service.",
};

export default async function HouseCleaningPortlandPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningPortlandClient googleReviews={googleReviews} />;
}
