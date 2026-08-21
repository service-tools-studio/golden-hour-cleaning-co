"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const CALENDLY_EVENTS = {
  /** Soft conversion: visitor opened the scheduler from your site. */
  click: "calendly_click",
} as const;

/** Google Ads "Book appointment" conversion (Calendly open). */
export const GOOGLE_ADS_ID = "AW-17703846603";
export const GOOGLE_ADS_CALENDLY_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CALENDLY_SEND_TO ||
  "AW-17703846603/mIhyCLPzxL8bEMuF7flB";

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
 * Fire sitewide Calendly-open signals:
 * 1) GA4 / dataLayer event `calendly_click`
 * 2) Google Ads conversion `AW-17703846603/mIhyCLPzxL8bEMuF7flB` ("Book appointment")
 *
 * Matches Google's gtag_report_conversion send_to; navigation is not blocked because
 * Calendly opens in a new tab / window.open in our flows.
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

  if (typeof window.gtag !== "function") return;

  window.gtag("event", CALENDLY_EVENTS.click, payload);

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CALENDLY_SEND_TO,
    ...payload,
  });
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
