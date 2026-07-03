"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import Services from "@/components/residential/Services";
import QuoteCalculator from "@/components/residential/QuoteCalculator";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return "deep";
}

export default function ResidentialServicesClient({
  initialLevel,
}: {
  initialLevel: Level;
}) {
  const [showCalendly, setShowCalendly] = useState(false);
  const searchParams = useSearchParams();
  const level = levelFromUrl(searchParams.get("level")) || initialLevel;

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#quote") {
      const el = document.getElementById("quote");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [level]);

  return (
    <>
      <ServicesPageHeader />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <Services />

        <section
          id="quote"
          className="mx-auto max-w-7xl px-6 py-10 md:py-12"
        >
          <QuoteCalculator
            showCalendly={showCalendly}
            setShowCalendly={setShowCalendly}
            initialLevel={level}
            title="Get a Quote & Book Instantly"
          />
        </section>

        <Footer />
      </main>
    </>
  );
}

