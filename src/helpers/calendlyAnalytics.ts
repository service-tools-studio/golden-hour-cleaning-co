"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const CALENDLY_EVENTS = {
  /** Soft conversion: visitor opened the scheduler from your site. */
  click: "calendly_click",
} as const;

type TrackCalendlyClickParams = {
  source: string;
  url?: string;
  cleanType?: string;
  attribution?: PpcAttribution;
  /** Extra GA4 / dataLayer fields */
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
 * Fire a sitewide Calendly-open conversion signal to dataLayer + gtag.
 * Mark `calendly_click` as a key event/conversion in GA4 (and import to Google Ads).
 * Optionally fires a Google Ads conversion if NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_SEND_TO is set
 * (format: AW-XXXXXXXXX/label).
 */
export function trackCalendlyClick({
  source,
  url,
  cleanType,
  attribution,
  extra,
}: TrackCalendlyClickParams) {
  if (typeof window === "undefined") return;

  const dedupeKey = `${source}|${url || window.location.pathname}`;
  if (!shouldTrack(dedupeKey)) return;

  const payload = {
    event_category: "calendly",
    page_path: window.location.pathname,
    calendly_source: source,
    calendly_url: url,
    clean_type: cleanType,
    ...attributionParams(attribution),
    ...extra,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: CALENDLY_EVENTS.click, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", CALENDLY_EVENTS.click, payload);

    const adsSendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_SEND_TO;
    if (adsSendTo) {
      window.gtag("event", "conversion", {
        send_to: adsSendTo,
        ...payload,
      });
    }
  }
}

export function isCalendlyHref(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com");
  } catch {
    return /calendly\.com/i.test(href);
  }
}
