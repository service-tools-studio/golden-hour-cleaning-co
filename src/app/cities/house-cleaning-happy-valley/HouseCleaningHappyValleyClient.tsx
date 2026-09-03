"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningHappyValleyContent from "@/components/residential/HouseCleaningHappyValleyContent";
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";

export default function HouseCleaningHappyValleyClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningHappyValleyContent />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <ResidentialPricingGuide />
        </div>

        <Footer />
      </main>
    </div>
  );
}
