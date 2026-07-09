"use client";

import { useState } from "react";
import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningPortlandContent from "@/components/residential/HouseCleaningPortlandContent";
import QuoteCalculator from "@/components/residential/QuoteCalculator";

export default function HouseCleaningPortlandClient() {
  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      {!showCalendly && <Header />}

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningPortlandContent />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <QuoteCalculator
            showCalendly={showCalendly}
            setShowCalendly={setShowCalendly}
            initialLevel="deep"
            title="Get a Quote & Book Instantly"
            subtitle="Transparent, size-based pricing with thoughtful attention to your unique Portland home."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
