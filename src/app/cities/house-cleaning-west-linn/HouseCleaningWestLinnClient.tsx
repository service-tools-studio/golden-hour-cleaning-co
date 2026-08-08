"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningWestLinnContent from "@/components/residential/HouseCleaningWestLinnContent";
import QuoteCalculator from "@/components/residential/QuoteCalculator";

export default function HouseCleaningWestLinnClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningWestLinnContent />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <QuoteCalculator
            initialLevel="deep"
            title="Get a Quote & Book Instantly"
            subtitle="Get an instant estimate based on your home’s size and clean type. Because every home is unique, we’ll confirm your final price after a quick walkthrough based on the condition and level of care needed."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
