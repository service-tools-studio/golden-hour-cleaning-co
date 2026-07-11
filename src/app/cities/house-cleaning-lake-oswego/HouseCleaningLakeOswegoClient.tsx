"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningLakeOswegoContent from "@/components/residential/HouseCleaningLakeOswegoContent";
import QuoteCalculator from "@/components/residential/QuoteCalculator";

export default function HouseCleaningLakeOswegoClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningLakeOswegoContent />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <QuoteCalculator
            initialLevel="deep"
            title="Get a Quote & Book Instantly"
            subtitle="Transparent, size-based pricing with thoughtful attention to your unique Lake Oswego home."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
