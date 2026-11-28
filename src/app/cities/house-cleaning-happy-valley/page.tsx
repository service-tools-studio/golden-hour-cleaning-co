import type { Metadata } from "next";
import { getGoogleReviews } from "@/lib/googleReviewsServer";
import HouseCleaningHappyValleyClient from "./HouseCleaningHappyValleyClient";

export const metadata: Metadata = {
  title: "House Cleaning Happy Valley, OR | Golden Hour Cleaning Co.",
  description:
    "Trusted house cleaning in Happy Valley, OR — recurring, deep, move-out, and post-construction cleaning with free quotes and dependable, detail-oriented service.",
};

export default async function HouseCleaningHappyValleyPage() {
  const googleReviews = await getGoogleReviews();
  return <HouseCleaningHappyValleyClient googleReviews={googleReviews} />;
}
