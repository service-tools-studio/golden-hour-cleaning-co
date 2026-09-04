"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Only real in-page anchors should keep scroll; ignore bare `#` / junk from email trackers. */
export function hasIntentionalHash() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return false;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return false;
  return Boolean(document.getElementById(id));
}

/**
 * Soft navigations and cold opens (e.g. email signature links) can leave the
 * page mid-scroll. Force top unless a real section hash is present.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !hasIntentionalHash()) {
        scrollWindowToTop();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasIntentionalHash()) return;

    scrollWindowToTop();

    const raf = window.requestAnimationFrame(scrollWindowToTop);
    const t0 = window.setTimeout(scrollWindowToTop, 0);
    const t1 = window.setTimeout(scrollWindowToTop, 50);
    const t2 = window.setTimeout(scrollWindowToTop, 250);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
