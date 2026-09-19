"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningHillsboroContent from "@/components/residential/HouseCleaningHillsboroContent";

export default function HouseCleaningHillsboroClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-clip"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningHillsboroContent />

        <Footer />
      </main>
    </div>
  );
}
