"use client";

import ScrollDepthTracker from "@/components/analytics/ScrollDepthTracker";
import ScrollDebugOverlay from "@/components/ScrollDebugOverlay";
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

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  return (
    <div id="page-top" className="relative min-h-screen bg-amber-50 text-stone-900">
      <ScrollDebugOverlay />
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main id="content">
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
