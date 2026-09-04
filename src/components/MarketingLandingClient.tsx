"use client";

import { useEffect } from "react";
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
import {
  hasIntentionalHash,
  scrollWindowToTop,
} from "@/components/ScrollToTopOnNavigate";

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  // Aggressively pin every scrollport to top for a few seconds on cold open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasIntentionalHash()) return;

    scrollWindowToTop();

    let userMoved = false;
    let touchStartY: number | null = null;
    const started = performance.now();

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY == null) return;
      const y = event.touches[0]?.clientY ?? touchStartY;
      if (Math.abs(y - touchStartY) > 14) userMoved = true;
    };
    const onWheel = () => {
      userMoved = true;
    };

    const pin = () => {
      if (userMoved || hasIntentionalHash()) return;
      if (performance.now() - started > 5000) return;
      scrollWindowToTop();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    const interval = window.setInterval(pin, 100);
    const stop = window.setTimeout(() => window.clearInterval(interval), 5000);

    return () => {
      userMoved = true;
      window.clearInterval(interval);
      window.clearTimeout(stop);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, [pagePath]);

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
