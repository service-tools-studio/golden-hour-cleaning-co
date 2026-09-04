"use client";

import { useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    if (hasIntentionalHash()) return;
    scrollWindowToTop();
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
