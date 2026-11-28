"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningHappyValleyContent from "@/components/residential/HouseCleaningHappyValleyContent";
import type { GoogleReviewsCache } from "@/lib/googleReviewsServer";

export default function HouseCleaningHappyValleyClient({
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
        <HouseCleaningHappyValleyContent googleReviews={googleReviews} />

        <Footer />
      </main>
    </div>
  );
}
