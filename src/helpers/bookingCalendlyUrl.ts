/**
 * Calendly URL builder for public cleaning lead forms (quote + book-online).
 *
 * Prefills standard invitee fields plus custom answers (a1, a2, …) matching
 * the residential-cleaning event’s invitee question order.
 *
 * Custom invitee question order on the residential event:
 *   a1 = Phone Number
 *   a2 = Address of Service
 *   a3 = Number of Beds
 *   a4 = Number of Baths
 *   a5 = Square Footage
 *   a6 = Anything you'd like us to know?
 *
 * Home details also go in utm_content for the internal calendar-details tool.
 *
 * Safe for client and server (API email) use.
 */

import {
  fullNameFromLead,
  type CleaningLeadAttribution,
  type CleaningLeadFormState,
} from "@/lib/cleaningLead";
import {
  bookingCalendlyUrlForMarket,
  getMarketIdFromPath,
  type MarketId,
} from "@/lib/markets";
import { isMarketId } from "@/lib/marketPreference";

/** Standard Calendly invitee query params. */
export const CALENDLY_STANDARD_FIELD_MAP = {
  name: "name",
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
} as const;

/**
 * Custom invitee questions on each market’s residential Calendly event
 * (Portland + Phoenix use the same a1–a6 order). Positions are 0-based → a1, a2, …
 */
export const CALENDLY_CUSTOM_FIELD_MAP = {
  phone: "a1",
  address: "a2",
  bedrooms: "a3",
  bathrooms: "a4",
  squareFootage: "a5",
  notes: "a6",
} as const;

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;

export type BookingCalendlyInput = {
  form: CleaningLeadFormState;
  leadPath: "Personalized Quote" | "Book Online";
  baseUrl?: string;
  attribution?: CleaningLeadAttribution | null;
  marketId?: MarketId;
};

/** Resolve market for Calendly base URL (explicit id → landing path → Portland). */
export function resolveLeadMarketIdForCalendly(
  marketId: unknown,
  attribution?: CleaningLeadAttribution | null,
): MarketId {
  const raw =
    typeof marketId === "string" ? marketId : undefined;
  if (isMarketId(raw)) return raw;
  const landing = attribution?.landing_path?.trim() ?? "";
  if (landing) {
    const fromPath = getMarketIdFromPath(landing.split("?")[0] ?? landing);
    if (fromPath === "phoenix") return "phoenix";
  }
  if (
    /phoenix-deep-cleaning|phoenix-move-out-cleaning/i.test(landing)
  ) {
    return "phoenix";
  }
  return "portland";
}

function compactCondition(condition: string): string {
  const head = condition.split("—")[0]?.trim();
  return head || condition;
}

/** Keep tilde-delimited utm_content values from breaking the parser. */
function compactUtmValue(value: string): string {
  return value
    .trim()
    .replace(/~/g, " ")
    .replace(/=/g, "-")
    .replace(/\s+/g, " ");
}

export function buildBookingCalendlyUrl({
  form,
  leadPath,
  baseUrl,
  attribution = null,
  marketId,
}: BookingCalendlyInput): string {
  const resolvedMarket = resolveLeadMarketIdForCalendly(marketId, attribution);
  const calendlyBase =
    baseUrl ?? bookingCalendlyUrlForMarket(resolvedMarket);
  let url: URL;
  try {
    url = new URL(calendlyBase);
  } catch {
    console.error("Invalid Calendly baseUrl:", calendlyBase);
    return calendlyBase;
  }

  const params = url.searchParams;
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const name = fullNameFromLead(form);
  const email = form.email.trim();
  const phone = form.mobilePhone.trim();
  const address = form.address.trim();
  const notes = form.notes.trim();
  const bedrooms = form.bedrooms.trim();
  const bathrooms = form.bathrooms.trim();
  const squareFootage = form.homeSize.trim().replace(/,/g, "");

  // Event uses separated name format — set both full name and parts.
  if (name) params.set(CALENDLY_STANDARD_FIELD_MAP.name, name);
  if (firstName) params.set(CALENDLY_STANDARD_FIELD_MAP.firstName, firstName);
  if (lastName) params.set(CALENDLY_STANDARD_FIELD_MAP.lastName, lastName);
  if (email) params.set(CALENDLY_STANDARD_FIELD_MAP.email, email);

  const customValues: Record<string, string> = {
    phone,
    address,
    notes,
    bedrooms,
    bathrooms,
    squareFootage,
  };

  for (const [key, paramName] of Object.entries(CALENDLY_CUSTOM_FIELD_MAP)) {
    const value = customValues[key];
    if (paramName && value) params.set(paramName, value);
  }

  const attrs =
    attribution && typeof attribution === "object" ? attribution : {};

  const utmSource =
    leadPath === "Book Online" ? "book_online" : "request_a_quote";
  params.set("utm_source", attrs.utm_source || utmSource);
  params.set("utm_medium", attrs.utm_medium || "website");
  params.set(
    "utm_campaign",
    attrs.utm_campaign ||
      (leadPath === "Book Online" ? "online_booking" : "personalized_quote"),
  );
  if (attrs.utm_term) params.set("utm_term", attrs.utm_term);

  const contentParts = [
    `lead=${leadPath === "Book Online" ? "book_online" : "personalized_quote"}`,
    `type=${form.cleaningType || ""}`,
    `bed=${bedrooms}`,
    `ba=${bathrooms}`,
    `sf=${squareFootage}`,
    `cond=${compactCondition(form.condition)}`,
    address ? `addr=${compactUtmValue(address)}` : "",
    attrs.landing_path
      ? `lp=${attrs.landing_path.replace(/^\//, "")}`
      : "",
  ]
    .filter(Boolean)
    .join("~");

  params.set("utm_content", contentParts);

  for (const key of CLICK_ID_KEYS) {
    const value = attrs[key];
    if (value) params.set(key, value);
  }

  return url.toString();
}
