"use client";

import { useEffect } from "react";
import {
  isTelHref,
  trackClickToCall,
} from "@/helpers/clickToCallAnalytics";

function resolveCallSource(anchor: HTMLAnchorElement): string {
  if (anchor.dataset.callSource) return anchor.dataset.callSource;

  const label = (anchor.getAttribute("aria-label") || anchor.textContent || "")
    .trim()
    .toLowerCase();

  if (label.includes("call us to book") || label.includes("call to book")) {
    return "call_to_book";
  }
  if (label.includes("call us") || label.includes("call now")) {
    return "call_us";
  }
  if (label.includes("call")) return "call_link";
  return "tel_link";
}

/**
 * Catches every <a href="tel:…"> click sitewide and fires `click_to_call`
 * (+ Google Ads click-to-call conversion). Does not preventDefault so the
 * dialer always opens.
 */
export default function ClickToCallTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      // Ignore modified clicks that open a new browsing context unexpectedly
      if (event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.dataset.callSkipAuto === "true") return;

      const href = anchor.getAttribute("href") || anchor.href;
      if (!isTelHref(href)) return;

      trackClickToCall({
        source: resolveCallSource(anchor),
        url: anchor.href || href,
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
