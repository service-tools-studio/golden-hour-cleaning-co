"use client";

import { getPpcAttribution, type PpcAttribution } from "./ppcAttribution";

export const PPC_MOVE_OUT_EVENTS = {
  landingView: "move_out_landing_view",
  quoteStarted: "move_out_quote_started",
  quoteViewed: "move_out_quote_viewed",
  quoteCompleted: "move_out_quote_completed",
  calendlyClick: "move_out_calendly_click",
  bookingCompleted: "move_out_booking_completed",
} as const;

export type PpcMoveOutEvent =
  (typeof PPC_MOVE_OUT_EVENTS)[keyof typeof PPC_MOVE_OUT_EVENTS];

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
export function trackPpcMoveOutEvent(
  eventName: PpcMoveOutEvent,
  params: EventParams = {},
  attribution?: PpcAttribution,
) {
  if (typeof window === "undefined") return;

  const payload = {
    event_category: "ppc_move_out",
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

export function isPpcMoveOutPath(pathname = window.location.pathname) {
  return pathname === "/portland-move-out-cleaning";
}
