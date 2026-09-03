"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningPortlandContent from "@/components/residential/HouseCleaningPortlandContent";
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";

export default function HouseCleaningPortlandClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningPortlandContent />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <ResidentialPricingGuide />
        </div>

        <Footer />
      </main>
    </div>
  );
}
