"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningTigardContent from "@/components/residential/HouseCleaningTigardContent";

export default function HouseCleaningTigardClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-clip"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningTigardContent />

        <Footer />
      </main>
    </div>
  );
}
