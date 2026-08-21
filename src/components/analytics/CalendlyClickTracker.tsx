"use client";

import { useEffect } from "react";
import {
  isCalendlyHref,
  trackCalendlyClick,
} from "@/helpers/calendlyAnalytics";

/**
 * Catches any <a href="…calendly.com…"> click sitewide so outbound
 * scheduler links fire the same conversion event.
 * Programmatic window.open() paths still need an explicit trackCalendlyClick call.
 */
export default function CalendlyClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.dataset.calendlySkipAuto === "true") return;
      if (!isCalendlyHref(anchor.href)) return;

      trackCalendlyClick({
        source: anchor.dataset.calendlySource || "link",
        url: anchor.href,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
