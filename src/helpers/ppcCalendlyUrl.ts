import { CONTACT } from "../constants.js";
import { buildCalendlyUrlWithUtm } from "./calendlyHelpers.js";
import type { PpcAttribution } from "./ppcAttribution";

type QuoteResult = {
  cleanType?: string;
  bedrooms?: number;
  bathrooms?: number;
  estSqft?: number;
  sqftInput?: number;
  billableHoursLow?: number;
  billableHoursHigh?: number;
  billableHours?: number;
  addonFridge?: boolean;
  addonOven?: boolean;
  addonSecondKitchen?: boolean;
  totalAfterPromoLow?: number;
  totalAfterPromoHigh?: number;
  totalAfterPromo?: number;
  time?: {
    onSiteRangeLow?: number;
    onSiteRangeHigh?: number;
    cleaners?: number;
  };
};

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;

/**
 * Builds a Calendly URL for the PPC landing page.
 * Keeps inbound Ads UTMs / click IDs and still attaches quote metadata.
 * Does not change the production calculator helper.
 *
 * Calendly stores utm_* on the invitee. Google Ads click IDs (gclid, and
 * gbraid/wbraid on iOS) are also set as first-class query params so the
 * booking URL itself identifies the ad click.
 */
export function buildPpcCalendlyUrl(
  result: QuoteResult,
  promo: { applied?: boolean; code?: string; amount?: number },
  attribution: PpcAttribution = {}
) {
  const url = buildCalendlyUrlWithUtm(CONTACT.bookingUrl, result, promo);

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  parsed.searchParams.set(
    "utm_source",
    attribution.utm_source || "google"
  );
  parsed.searchParams.set(
    "utm_medium",
    attribution.utm_medium || "cpc"
  );
  parsed.searchParams.set(
    "utm_campaign",
    attribution.utm_campaign || "portland_deep_cleaning"
  );

  if (attribution.utm_term) {
    parsed.searchParams.set("utm_term", attribution.utm_term);
  }
  if (attribution.utm_id) {
    parsed.searchParams.set("utm_id", attribution.utm_id);
  }

  for (const key of CLICK_ID_KEYS) {
    const value = attribution[key];
    if (value) parsed.searchParams.set(key, value);
  }

  const quoteContent = parsed.searchParams.get("utm_content") || "";
  const extras = [
    attribution.gclid ? `gclid=${attribution.gclid}` : "",
    attribution.gbraid ? `gbraid=${attribution.gbraid}` : "",
    attribution.wbraid ? `wbraid=${attribution.wbraid}` : "",
    attribution.utm_content ? `ad_content=${attribution.utm_content}` : "",
    "lp=portland-deep-cleaning",
  ]
    .filter(Boolean)
    .join("~");

  parsed.searchParams.set(
    "utm_content",
    [quoteContent, extras].filter(Boolean).join("~")
  );

  return parsed.toString();
}
