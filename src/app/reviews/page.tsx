import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Google Reviews | Golden Hour Cleaning Co.",
  description:
    "Read 5-star Google reviews from Golden Hour Cleaning Co. clients across the Portland metro area, then view all reviews on Google.",
};

export default function ReviewsPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#quote" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <GoogleReviews variant="page" />
        <Footer />
      </main>
    </>
  );
}
