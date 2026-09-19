"use client";

import Footer from "@/components/residential/Footer";
import Header from "@/components/residential/Header";
import HouseCleaningLakeOswegoContent from "@/components/residential/HouseCleaningLakeOswegoContent";

export default function HouseCleaningLakeOswegoClient() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <Header />

      <main
        id="content"
        className="overflow-x-clip"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <HouseCleaningLakeOswegoContent />

        <Footer />
      </main>
    </div>
  );
}
