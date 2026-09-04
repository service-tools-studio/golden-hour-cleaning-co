"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

const KNOWN_SECTION_IDS = new Set([
  "hero",
  "reviews",
  "services",
  "quote",
  "content",
  "pricing",
]);

/** Only real in-page anchors should keep scroll; ignore bare `#`, text fragments, trackers. */
export function hasIntentionalHash() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return false;
  if (hash.includes(":~:")) return false;
  const id = decodeURIComponent(hash.slice(1));
  if (!id || id.includes(":~:")) return false;
  if (KNOWN_SECTION_IDS.has(id)) return true;
  return Boolean(document.getElementById(id));
}

/** Soft navigations: jump to top unless a real section hash is present. */
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
  }, [pathname]);

  return null;
}
