"use client";

import { useEffect, useRef } from "react";

const THRESHOLDS = [50, 75, 100] as const;

type ScrollDepthPage = "/" | "/residential" | "/commercial";

function trackScrollDepth(pagePath: ScrollDepthPage, percent: number) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "scroll_depth", {
    event_category: "engagement",
    event_label: `${percent}%`,
    page_path: pagePath,
    percent_scrolled: percent,
  });
}

export default function ScrollDepthTracker({
  pagePath,
}: {
  pagePath: ScrollDepthPage;
}) {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent =
        scrollable <= 0
          ? 100
          : Math.min(100, Math.round((window.scrollY / scrollable) * 100));

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          trackScrollDepth(pagePath, threshold);
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pagePath]);

  return null;
}
