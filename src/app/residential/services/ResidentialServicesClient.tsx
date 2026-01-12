"use client";

import { useState } from "react";
import Footer from "@/components/residential/Footer";
import Services from "@/components/residential/Services";
import QuoteCalculator from "@/components/residential/QuoteCalculator";
import Image from "next/image";
import Link from "next/link";

type Level = "standard" | "deep" | "move_out";

export default function ResidentialServicesClient({
  initialLevel,
}: {
  initialLevel: Level;
}) {
  const [showCalendly, setShowCalendly] = useState(false);
  const [level, setLevel] = useState<Level>(initialLevel);

  return (
    <>
      <header className="mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-6">
        <Link href="/" aria-label="Go to homepage">
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

