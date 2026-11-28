import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { getGoogleReviews } from "@/lib/googleReviewsServer";

export const metadata: Metadata = {
  title: "Portland House Cleaning Reviews | Golden Hour Cleaning Co.",
  description:
    "Read Google reviews from Golden Hour Cleaning Co. clients across Portland and the metro area, then view all reviews on Google.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const googleReviews = await getGoogleReviews();

  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <GoogleReviews variant="page" googleReviews={googleReviews} />
        <Footer />
      </main>
    </>
  );
}
