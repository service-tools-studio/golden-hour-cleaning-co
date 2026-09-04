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

/**
 * Soft navigations + iOS Chrome cold opens: keep the window at top unless a
 * real section hash is present. Also correct small jumps when the visual
 * viewport resizes (Chrome collapsing/expanding toolbars).
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

    let userMoved = false;
    let touchStartY: number | null = null;
    const started = performance.now();

    const markUser = () => {
      userMoved = true;
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY == null) return;
      const y = event.touches[0]?.clientY ?? touchStartY;
      if (Math.abs(y - touchStartY) > 12) markUser();
    };

    const correctSmallJump = () => {
      if (userMoved || hasIntentionalHash()) return;
      if (performance.now() - started > 4000) return;
      const y = window.scrollY || 0;
      // iOS Chrome often lands slightly scrolled; yank only small offsets.
      if (y > 0 && y < 160) scrollWindowToTop();
    };

    window.addEventListener("wheel", markUser, { passive: true });
    window.addEventListener("keydown", markUser);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const vv = window.visualViewport;
    vv?.addEventListener("resize", correctSmallJump);
    vv?.addEventListener("scroll", correctSmallJump);
    window.addEventListener("scroll", correctSmallJump, { passive: true });

    const interval = window.setInterval(correctSmallJump, 100);
    const stop = window.setTimeout(() => {
      window.clearInterval(interval);
      vv?.removeEventListener("resize", correctSmallJump);
      vv?.removeEventListener("scroll", correctSmallJump);
      window.removeEventListener("scroll", correctSmallJump);
    }, 4000);

    return () => {
      userMoved = true;
      window.clearInterval(interval);
      window.clearTimeout(stop);
      window.removeEventListener("wheel", markUser);
      window.removeEventListener("keydown", markUser);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      vv?.removeEventListener("resize", correctSmallJump);
      vv?.removeEventListener("scroll", correctSmallJump);
      window.removeEventListener("scroll", correctSmallJump);
    };
  }, [pathname]);

  return null;
}
