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

/**
 * Correct small post-load scroll jumps (iOS visual viewport / late layout)
 * without fighting real user scrolls.
 */
function usePreventSmallLoadJump() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasIntentionalHash()) return;

    let userMoved = false;
    let touchStartY: number | null = null;
    const started = performance.now();
    const MAX_MS = 3500;
    const MAX_JUMP = 200;

    const markUser = () => {
      userMoved = true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY == null) return;
      const y = event.touches[0]?.clientY ?? touchStartY;
      // Ignore the tap that opened the page; only unlock on a real drag.
      if (Math.abs(y - touchStartY) > 10) markUser();
    };

    window.addEventListener("wheel", markUser, { passive: true });
    window.addEventListener("keydown", markUser);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const id = window.setInterval(() => {
      if (userMoved || hasIntentionalHash()) return;
      if (performance.now() - started > MAX_MS) return;
      const y = window.scrollY || window.pageYOffset || 0;
      if (y > 0 && y < MAX_JUMP) scrollWindowToTop();
    }, 50);

    const stop = window.setTimeout(() => {
      window.clearInterval(id);
    }, MAX_MS + 50);

    return () => {
      userMoved = true;
      window.clearInterval(id);
      window.clearTimeout(stop);
      window.removeEventListener("wheel", markUser);
      window.removeEventListener("keydown", markUser);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);
}

export default function MarketingLandingClient({ pagePath }: Props) {
  usePreventSmallLoadJump();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-amber-50 text-stone-900">
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main
        id="content"
        className="overflow-x-clip"
        style={{ scrollPaddingTop: "var(--header-height, 120px)" }}
      >
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
