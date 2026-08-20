"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ScrollDepthTracker from "@/components/analytics/ScrollDepthTracker";
import MeetFoundersSection from "@/components/home/MeetFoundersSection";
import ServicesPreviewSection from "@/components/home/ServicesPreviewSection";
import BeforeAfter from "@/components/residential/BeforeAfter";
import ClientExperienceSection from "@/components/residential/ClientExperienceSection";
import Footer from "@/components/residential/Footer";
import GoogleMapsProvider from "@/components/residential/GoogleMapsProvider";
import GoogleReviews from "@/components/residential/GoogleReviews";
import Header from "@/components/residential/Header";
import Hero from "@/components/residential/Hero";
import QuoteCalculator from "@/components/residential/QuoteCalculator";
import ServiceAreaMap from "@/components/residential/ServiceAreaMap";
import { scrollToId } from "@/helpers/scrollToId";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level | null {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return null;
}

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  const searchParams = useSearchParams();
  const urlLevel = levelFromUrl(searchParams.get("level"));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#quote") {
      scrollToId("#quote", 8, { focus: true });
    }
  }, [urlLevel]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
        <Hero />

        <GoogleMapsProvider>
          <GoogleReviews />
          <ClientExperienceSection />
          <ServiceAreaMap />
        </GoogleMapsProvider>

        <ServicesPreviewSection />

        <MeetFoundersSection />

        <BeforeAfter />

        <div className="pt-10 pb-16 md:pb-20" id="quote">
          <QuoteCalculator
            initialLevel={urlLevel ?? undefined}
            title="Get a Quote & Book Instantly"
            subtitle="Get an instant estimate based on your home’s size and clean type. Because every home is unique, we’ll confirm your final price after a quick walkthrough based on the condition and level of care needed."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
