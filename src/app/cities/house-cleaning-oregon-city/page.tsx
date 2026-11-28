import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningOregonCityClient from "./HouseCleaningOregonCityClient";

export const metadata: Metadata = {
  title: "House Cleaning Oregon City, OR | Golden Hour Cleaning Co.",
  description:
    "Trusted house cleaning in Oregon City, OR — recurring, deep, move-out, and post-construction cleaning with free quotes and reliable, detail-oriented service.",
};

export default async function HouseCleaningOregonCityPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningOregonCityClient googleReviews={googleReviews} />;
}
