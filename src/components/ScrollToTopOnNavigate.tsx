"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Reset every scrollport — iOS Chrome often scrolls an inner element, not `window`. */
export function scrollWindowToTop() {
  if (typeof window === "undefined") return;

  const zeroEl = (el: Element | null | undefined) => {
    if (!el || !(el instanceof HTMLElement)) return;
    if (el.scrollTop) el.scrollTop = 0;
    if (el.scrollLeft) el.scrollLeft = 0;
  };

  window.scrollTo(0, 1);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  zeroEl(document.scrollingElement);
  zeroEl(document.documentElement);
  zeroEl(document.body);

  document.querySelectorAll("*").forEach((el) => {
    if (el instanceof HTMLElement && el.scrollTop > 0) zeroEl(el);
  });

  const vv = window.visualViewport;
  if (vv && vv.offsetTop > 0) {
    window.scrollTo({
      top: Math.max(0, window.scrollY + vv.offsetTop),
      behavior: "auto",
    });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  document
    .getElementById("page-top")
    ?.scrollIntoView({ block: "start", behavior: "auto" });
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
  if (id === "page-top") return false;
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
