"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";
import ServiceAreaMap from "@/components/residential/ServiceAreaMap";
import { scrollToId } from "@/helpers/scrollToId";
import {
  hasIntentionalHash,
  scrollWindowToTop,
} from "@/components/ScrollToTopOnNavigate";

type Props = {
  pagePath: "/" | "/residential";
};

/** Keep the window at top until the user scrolls, or the lock window ends. */
function useColdOpenScrollLock(enabled: boolean) {
  const userMovedRef = useRef(false);

  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (hasIntentionalHash()) return;
    scrollWindowToTop();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (hasIntentionalHash()) {
      if (window.location.hash === "#quote") {
        scrollToId("#quote", 8, { focus: true });
      }
      return;
    }

    userMovedRef.current = false;
    scrollWindowToTop();

    const markUserMoved = () => {
      userMovedRef.current = true;
    };

    const onScroll = () => {
      if (userMovedRef.current || hasIntentionalHash()) return;
      if (window.scrollY > 0) scrollWindowToTop();
    };

    window.addEventListener("wheel", markUserMoved, { passive: true });
    window.addEventListener("touchmove", markUserMoved, { passive: true });
    window.addEventListener("keydown", markUserMoved);
    window.addEventListener("scroll", onScroll, { passive: true });

    const timers = [0, 50, 150, 400, 1000, 2000].map((ms) =>
      window.setTimeout(() => {
        if (!userMovedRef.current && !hasIntentionalHash()) {
          scrollWindowToTop();
        }
      }, ms)
    );

    const unlock = window.setTimeout(() => {
      window.removeEventListener("scroll", onScroll);
    }, 2500);

    return () => {
      window.removeEventListener("wheel", markUserMoved);
      window.removeEventListener("touchmove", markUserMoved);
      window.removeEventListener("keydown", markUserMoved);
      window.removeEventListener("scroll", onScroll);
      timers.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(unlock);
    };
  }, [enabled]);
}

export default function MarketingLandingClient({ pagePath }: Props) {
  useColdOpenScrollLock(true);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main
        id="content"
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

        <div className="pt-10 pb-14 md:pb-16" id="quote">
          <ResidentialPricingGuide />
        </div>

        <Footer />
      </main>
    </div>
  );
}
