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
 * Fire click-to-call conversion for any phone CTA:
 * 1) GA4 / dataLayer `click_to_call`
 * 2) Google Ads `AW-17703846603/Ct_7CNe1nOYcEMuF7flB` (value 1 USD)
 *
 * Does not block the dialer — call this from a click listener without preventDefault.
 */
export function trackClickToCall({
  source = "tel_link",
  url,
  attribution,
  extra,
}: TrackClickToCallParams): boolean {
  if (typeof window === "undefined") return false;

  const dedupeKey = `${source}|${url || window.location.pathname}`;
  if (!shouldTrack(dedupeKey)) return false;

  const payload = {
    event_category: "phone",
    page_path: window.location.pathname,
    call_source: source,
    call_url: url,
    ...attributionParams(attribution),
    ...extra,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: CLICK_TO_CALL_EVENTS.click, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", CLICK_TO_CALL_EVENTS.click, payload);
    window.gtag("event", "conversion", {
      ...payload,
      send_to: GOOGLE_ADS_CLICK_TO_CALL_SEND_TO,
      value: 1.0,
      currency: "USD",
    });
  }

  return true;
}

export function isTelHref(href: string | null | undefined): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (/^tel:/i.test(trimmed)) return true;
  try {
    return new URL(trimmed, window.location.origin).protocol === "tel:";
  } catch {
    return false;
  }
}
