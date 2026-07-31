"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Next.js soft navigations can keep the previous scroll position on mobile,
 * especially when jumping between similar city landing pages from the footer.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
