"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const CLICK_TO_CALL_EVENTS = {
  click: "click_to_call",
} as const;

/** Google Ads "Click to call" conversion. */
export const GOOGLE_ADS_CLICK_TO_CALL_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CLICK_TO_CALL_SEND_TO ||
  "AW-17703846603/Ct_7CNe1nOYcEMuF7flB";

type TrackClickToCallParams = {
  source?: string;
  url?: string;
  attribution?: PpcAttribution;
  extra?: Record<string, string | number | boolean | undefined>;
  /**
   * Optional navigation after the Ads ping (Google's gtag_report_conversion pattern).
   * For tel: links, pass the href so the dialer still opens if we preventDefault.
   */
  navigateTo?: string;
};

const recentKeys = new Map<string, number>();
const DEDUPE_MS = 1500;

function shouldTrack(key: string) {
  const now = Date.now();
  const last = recentKeys.get(key) ?? 0;
  if (now - last < DEDUPE_MS) return false;
  recentKeys.set(key, now);
  return true;
}

function attributionParams(attribution?: PpcAttribution) {
  const attrs = attribution ?? getPpcAttribution();
  return {
    gclid: attrs.gclid,
    gbraid: attrs.gbraid,
    wbraid: attrs.wbraid,
    utm_source: attrs.utm_source,
    utm_medium: attrs.utm_medium,
    utm_campaign: attrs.utm_campaign,
    utm_term: attrs.utm_term,
    landing_path: attrs.landing_path,
    captured_at: attrs.captured_at,
  };
}

/**
 * Fire click-to-call conversion:
 * 1) GA4 / dataLayer `click_to_call`
 * 2) Google Ads `AW-17703846603/Ct_7CNe1nOYcEMuF7flB` (value 1 USD)
 *
 * Matches Google's gtag_report_conversion for "Click to call".
 */
export function trackClickToCall({
  source = "link",
  url,
  attribution,
  extra,
  navigateTo,
}: TrackClickToCallParams) {
  if (typeof window === "undefined") return;

  const dedupeKey = `${source}|${url || navigateTo || window.location.pathname}`;
  if (!shouldTrack(dedupeKey)) return;

  const payload = {
    event_category: "phone",
    page_path: window.location.pathname,
    call_source: source,
    call_url: url || navigateTo,
    ...attributionParams(attribution),
    ...extra,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: CLICK_TO_CALL_EVENTS.click, ...payload });

  const navigate = () => {
    if (navigateTo) window.location.href = navigateTo;
  };

  if (typeof window.gtag !== "function") {
    navigate();
    return;
  }

  window.gtag("event", CLICK_TO_CALL_EVENTS.click, payload);

  let navigated = false;
  const done = () => {
    if (navigated) return;
    navigated = true;
    navigate();
  };

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CLICK_TO_CALL_SEND_TO,
    value: 1.0,
    currency: "USD",
    event_callback: done,
    ...payload,
  });

  // Fallback if the Ads ping never calls back (ad blockers, offline).
  if (navigateTo) {
    window.setTimeout(done, 2000);
  }
}

export function isTelHref(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    return new URL(href, window.location.origin).protocol === "tel:";
  } catch {
    return /^tel:/i.test(href);
  }
}
