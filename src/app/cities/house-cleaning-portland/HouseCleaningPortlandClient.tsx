"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningPortlandContent from "@/components/residential/HouseCleaningPortlandContent";
import type { GoogleReviewsCache } from "@/lib/googleReviewsServer";

export default function HouseCleaningPortlandClient({
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
        <HouseCleaningPortlandContent googleReviews={googleReviews} />

        <Footer />
      </main>
    </div>
  );
}
