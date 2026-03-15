"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/residential/Footer";
import Services from "@/components/residential/Services";
import QuoteCalculator from "@/components/residential/QuoteCalculator";
import Image from "next/image";
import Link from "next/link";

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
      <header className="mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-6">
        <Link href="/residential" aria-label="Go to residential home">
          <Image
            src="/assets/Golden Hour - commercial.png"
            alt="Golden Hour Cleaning Co."
            width={200}
            height={100}
            priority
            className="h-[100px] sm:h-[100px] w-auto cursor-pointer"
            sizes="(max-width: 640px) 260px, 360px"
          />
        </Link>

      </header>
      <main className="min-h-screen bg-amber-50 text-stone-900">
        <Services />
      </main>

      <section
        id="quote"
        className="mx-auto max-w-7xl px-6 py-16 translate-y-20"
      >
        <QuoteCalculator
          showCalendly={showCalendly}
          setShowCalendly={setShowCalendly}
          initialLevel={level}
          title="Get a Quote & Book Instantly"
        />
      </section>
      <Footer />
    </>
  );
}

