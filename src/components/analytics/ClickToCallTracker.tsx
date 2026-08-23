"use client";

import { useEffect } from "react";
import {
  isTelHref,
  trackClickToCall,
} from "@/helpers/clickToCallAnalytics";

/**
 * Catches any <a href="tel:…"> click sitewide (Call Us buttons, footer,
 * header banner, etc.) and fires the Google Ads click-to-call conversion.
 */
export default function ClickToCallTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.dataset.callSkipAuto === "true") return;
      if (!isTelHref(anchor.href)) return;

      event.preventDefault();
      trackClickToCall({
        source: anchor.dataset.callSource || "tel_link",
        url: anchor.href,
        navigateTo: anchor.href,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
