"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const QUOTE_EVENTS = {
  viewed: "quote_viewed",
} as const;

type TrackQuoteViewedParams = {
  quoteLow: number;
  quoteHigh: number;
  cleanType?: string;
  attribution?: PpcAttribution;
  extra?: Record<string, string | number | boolean | undefined>;
};

/**
 * Sitewide: visitor scrolled the quote range into view.
 */
export function trackQuoteViewed({
  quoteLow,
  quoteHigh,
  cleanType,
  attribution,
  extra,
}: TrackQuoteViewedParams) {
  if (typeof window === "undefined") return;

  const attrs = attribution ?? getPpcAttribution();
  const payload = {
    event_category: "quote",
    page_path: window.location.pathname,
    quote_low: quoteLow,
    quote_high: quoteHigh,
    clean_type: cleanType,
    gclid: attrs.gclid,
    gbraid: attrs.gbraid,
    wbraid: attrs.wbraid,
    utm_source: attrs.utm_source,
    utm_medium: attrs.utm_medium,
    utm_campaign: attrs.utm_campaign,
    utm_term: attrs.utm_term,
    landing_path: attrs.landing_path,
    captured_at: attrs.captured_at,
    ...extra,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: QUOTE_EVENTS.viewed, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", QUOTE_EVENTS.viewed, payload);
  }
}
