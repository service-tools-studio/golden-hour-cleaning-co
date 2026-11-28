"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningOregonCityContent from "@/components/residential/HouseCleaningOregonCityContent";
import type { GoogleReviewsCache } from "@/lib/googleReviewsServer";

export default function HouseCleaningOregonCityClient({
  googleReviews,
}: {
  googleReviews: GoogleReviewsCache;
}) {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-clip"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningOregonCityContent googleReviews={googleReviews} />

        <Footer />
      </main>
    </div>
  );
}
