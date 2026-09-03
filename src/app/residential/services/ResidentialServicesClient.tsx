"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import Services from "@/components/residential/Services";
import BeforeAfter from "@/components/residential/BeforeAfter";
import ServiceTrustBar from "@/components/residential/ServiceTrustBar";
import GoogleMapsProvider from "@/components/residential/GoogleMapsProvider";
import GoogleReviews from "@/components/residential/GoogleReviews";
import { SERVICES_PRICING_HASH } from "@/helpers/ctaLabels.js";
import { scrollToId } from "@/helpers/scrollToId";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level | null {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return null;
}

export default function ResidentialServicesClient({
  initialLevel,
}: {
  initialLevel: Level;
}) {
  const searchParams = useSearchParams();
  const urlLevel = levelFromUrl(searchParams.get("level"));
  const level = urlLevel ?? initialLevel;

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#quote" || hash === SERVICES_PRICING_HASH || hash === "#quote-calculator-heading") {
      scrollToId(SERVICES_PRICING_HASH, 8, { focus: true });
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

        <GoogleMapsProvider>
          <GoogleReviews />
        </GoogleMapsProvider>

        <Footer />
      </main>
    </>
  );
}
