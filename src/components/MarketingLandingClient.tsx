"use client";

import { useEffect } from "react";
import ScrollDepthTracker from "@/components/analytics/ScrollDepthTracker";
import MeetFoundersSection from "@/components/home/MeetFoundersSection";
import ServicesPreviewSection from "@/components/home/ServicesPreviewSection";
import BeforeAfter from "@/components/residential/BeforeAfter";
import ClientExperienceSection from "@/components/residential/ClientExperienceSection";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import Header from "@/components/residential/Header";
import Hero from "@/components/residential/Hero";
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";
import ServiceAreaMap from "@/components/residential/ServiceAreaMap";
import {
  hasIntentionalHash,
  scrollWindowToTop,
} from "@/components/ScrollToTopOnNavigate";

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  // iOS Chrome sometimes nudges scroll after first paint (often >500ms later).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasIntentionalHash()) return;

    scrollWindowToTop();
    const delays = [500, 1000, 1500, 2000, 3000];
    const timers = delays.map((ms) =>
      window.setTimeout(() => {
        if (!hasIntentionalHash()) scrollWindowToTop();
      }, ms),
    );

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [pagePath]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-amber-50 text-stone-900">
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main id="content" className="overflow-x-clip">
        <Hero />

        <GoogleReviews />
        <ClientExperienceSection />
        <ServiceAreaMap />

        <ServicesPreviewSection />

        <MeetFoundersSection />

        <BeforeAfter />

        <div className="pt-10 pb-14 md:pb-16" id="quote">
          <ResidentialPricingGuide />
        </div>

        <Footer />
      </main>
    </div>
  );
}
