"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BadgeCheck, CalendarCheck2, ShieldCheck, Stars } from "lucide-react";
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
import { Badge } from "@/helpers/ui-elements.jsx";
import { scrollToId } from "@/helpers/scrollToId";

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return "deep";
}

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  const searchParams = useSearchParams();
  const initialLevel = levelFromUrl(searchParams.get("level"));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#quote") {
      scrollToId("#quote", 8, { focus: true });
    }
  }, [initialLevel]);

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

        <div className="mx-auto flex min-h-[8rem] max-w-7xl flex-col items-center justify-center px-6 pt-5">
          <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 text-sm text-stone-700 sm:grid-cols-4">
            <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
            <Badge icon={<BadgeCheck />} label="Background-Checked" />
            <Badge icon={<CalendarCheck2 />} label="Real-Time Booking" />
            <Badge icon={<Stars />} label="5-Star Experience" />
          </div>
        </div>

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
            initialLevel={initialLevel}
            title="Get a Quote & Book Instantly"
            subtitle="Transparent, size-based pricing with thoughtful attention to your unique home."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
