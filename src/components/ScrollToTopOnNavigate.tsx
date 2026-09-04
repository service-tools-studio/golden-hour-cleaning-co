"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollWindowToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * Next.js soft navigations can keep the previous scroll position on mobile,
 * especially with client-only pages (home) that mount after the route change.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    scrollWindowToTop();

    // Client-only routes (e.g. home) mount after navigation; retry once layout settles.
    const raf = window.requestAnimationFrame(scrollWindowToTop);
    const t0 = window.setTimeout(scrollWindowToTop, 0);
    const t1 = window.setTimeout(scrollWindowToTop, 50);
    const t2 = window.setTimeout(scrollWindowToTop, 200);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
