"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const LEAD_FORM_EVENTS = {
  /** Personalized quote request submitted successfully. */
  quoteCompleted: "quote_request_completed",
  /** Book-online wizard submitted (before / as Calendly opens). */
  bookingWizardCompleted: "booking_wizard_completed",
} as const;

/**
 * Optional Google Ads conversion for quote request submit.
 * Create the conversion in Ads, then set:
 * NEXT_PUBLIC_GOOGLE_ADS_QUOTE_SEND_TO=AW-17703846603/xxxxxxxx
 */
export const GOOGLE_ADS_QUOTE_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_QUOTE_SEND_TO || "";

type TrackLeadParams = {
  source?: string;
  cleanType?: string;
  attribution?: PpcAttribution;
  extra?: Record<string, string | number | boolean | undefined>;
};

const recentKeys = new Map<string, number>();
const DEDUPE_MS = 2000;

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

function pushLeadEvent(
  eventName: string,
  payload: Record<string, string | number | boolean | undefined>,
  adsSendTo?: string,
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, payload);

  if (adsSendTo) {
    window.gtag("event", "conversion", {
      ...payload,
      send_to: adsSendTo,
      value: 1.0,
      currency: "USD",
    });
  }
}

/**
 * Quote wizard completed (API success). Fires GA4 / dataLayer always;
 * Google Ads conversion when NEXT_PUBLIC_GOOGLE_ADS_QUOTE_SEND_TO is set.
 */
export function trackQuoteRequestCompleted({
  source = "cleaning_lead_form",
  cleanType,
  attribution,
  extra,
}: TrackLeadParams = {}) {
  if (typeof window === "undefined") return;

  const dedupeKey = `quote|${source}|${window.location.pathname}`;
  if (!shouldTrack(dedupeKey)) return;

  const payload = {
    event_category: "lead",
    page_path: window.location.pathname,
    lead_source: source,
    clean_type: cleanType,
    ...attributionParams(attribution),
    ...extra,
  };

  pushLeadEvent(
    LEAD_FORM_EVENTS.quoteCompleted,
    payload,
    GOOGLE_ADS_QUOTE_SEND_TO || undefined,
  );
}

/**
 * Booking wizard completed (lead saved; Calendly usually opens next).
 * GA4 / dataLayer only — Ads "Book appointment" is fired via trackCalendlyClick.
 */
export function trackBookingWizardCompleted({
  source = "cleaning_lead_form",
  cleanType,
  attribution,
  extra,
}: TrackLeadParams = {}) {
  if (typeof window === "undefined") return;

  const dedupeKey = `booking|${source}|${window.location.pathname}`;
  if (!shouldTrack(dedupeKey)) return;

  const payload = {
    event_category: "lead",
    page_path: window.location.pathname,
    lead_source: source,
    clean_type: cleanType,
    ...attributionParams(attribution),
    ...extra,
  };

  pushLeadEvent(LEAD_FORM_EVENTS.bookingWizardCompleted, payload);
}
