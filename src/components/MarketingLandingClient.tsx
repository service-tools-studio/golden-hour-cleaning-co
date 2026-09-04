"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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

/**
 * Pin scroll to top on cold open. Undo unexpected jumps until the user
 * intentionally scrolls (wheel / drag), including jumps larger than a nudge.
 */
function usePinTopUntilUserScrolls() {
  const userMovedRef = useRef(false);

  useLayoutEffect(() => {
    if (hasIntentionalHash()) return;
    scrollWindowToTop();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasIntentionalHash()) return;

    userMovedRef.current = false;
    scrollWindowToTop();

    let touchStartY: number | null = null;
    const started = performance.now();
    const WINDOW_MS = 5000;

    const markUser = () => {
      userMovedRef.current = true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY == null) return;
      const y = event.touches[0]?.clientY ?? touchStartY;
      if (Math.abs(y - touchStartY) > 12) markUser();
    };

    const pinIfNeeded = () => {
      if (userMovedRef.current || hasIntentionalHash()) return;
      if (performance.now() - started > WINDOW_MS) return;
      if ((window.scrollY || 0) > 0) scrollWindowToTop();
    };

    window.addEventListener("wheel", markUser, { passive: true });
    window.addEventListener("keydown", markUser);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", pinIfNeeded, { passive: true });

    const interval = window.setInterval(pinIfNeeded, 100);
    const stop = window.setTimeout(() => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", pinIfNeeded);
    }, WINDOW_MS);

    return () => {
      userMovedRef.current = true;
      window.clearInterval(interval);
      window.clearTimeout(stop);
      window.removeEventListener("wheel", markUser);
      window.removeEventListener("keydown", markUser);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", pinIfNeeded);
    };
  }, []);
}

export default function MarketingLandingClient({ pagePath }: Props) {
  usePinTopUntilUserScrolls();

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
