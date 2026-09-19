import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Portland House Cleaning Reviews | Golden Hour Cleaning Co.",
  description:
    "Read Google reviews from Golden Hour Cleaning Co. clients across Portland and the metro area, then view all reviews on Google.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <GoogleReviews variant="page" />
        <Footer />
      </main>
    </>
  );
}
