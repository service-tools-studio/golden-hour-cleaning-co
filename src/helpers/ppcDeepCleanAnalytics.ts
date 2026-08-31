"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const PPC_DEEP_CLEAN_EVENTS = {
  landingView: "deep_clean_landing_view",
  quoteStarted: "deep_clean_quote_started",
  quoteViewed: "deep_clean_quote_viewed",
  quoteCompleted: "deep_clean_quote_completed",
  quoteLow: "deep_clean_quote_low",
  quoteHigh: "deep_clean_quote_high",
  calendlyClick: "deep_clean_calendly_click",
  calendlyInteraction: "deep_clean_calendly_interaction",
  bookingCompleted: "deep_clean_booking_completed",
} as const;

export type PpcDeepCleanEvent =
  (typeof PPC_DEEP_CLEAN_EVENTS)[keyof typeof PPC_DEEP_CLEAN_EVENTS];

type EventParams = Record<string, string | number | boolean | undefined>;

function attributionParams(attribution?: PpcAttribution): EventParams {
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
 * Pushes into dataLayer (GTM/GA4) and gtag when present.
 * Safe no-op if analytics scripts have not loaded.
 */
export function trackPpcDeepCleanEvent(
  eventName: PpcDeepCleanEvent,
  params: EventParams = {},
  attribution?: PpcAttribution
) {
  if (typeof window === "undefined") return;

  const payload = {
    event_category: "ppc_deep_clean",
    page_path: window.location.pathname,
    ...attributionParams(attribution),
    ...params,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
}
