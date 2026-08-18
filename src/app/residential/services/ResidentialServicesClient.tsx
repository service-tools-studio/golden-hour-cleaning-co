"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import Services from "@/components/residential/Services";
import BeforeAfter from "@/components/residential/BeforeAfter";
import ServiceTrustBar from "@/components/residential/ServiceTrustBar";
import QuoteCalculator from "@/components/residential/QuoteCalculator";
import GoogleMapsProvider from "@/components/residential/GoogleMapsProvider";
import GoogleReviews from "@/components/residential/GoogleReviews";
import { scrollToId } from "@/helpers/scrollToId";

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
  const searchParams = useSearchParams();
  const level = levelFromUrl(searchParams.get("level")) || initialLevel;

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#quote") {
      scrollToId("#quote", 8, { focus: true });
    } else if (hash === "#reviews") {
      scrollToId("#reviews", 8);
    }
  }, [level]);

  return (
    <>
      <ServicesPageHeader />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <Services />
        <BeforeAfter />
        <ServiceTrustBar />

        <section
          id="quote"
          className="mx-auto max-w-7xl px-6 pt-6 pb-10 md:pt-8 md:pb-12"
        >
          <QuoteCalculator
            initialLevel={level}
            title="Get a Quote & Book Instantly"
            subtitle="See your estimated price in about 30 seconds, then choose a cleaning time that works for you."
          />
        </section>

        <GoogleMapsProvider>
          <GoogleReviews />
        </GoogleMapsProvider>

        <Footer />
      </main>
    </>
  );
}
