/**
 * Calendly URL builder for public cleaning lead forms (quote + book-online).
 *
 * Prefills standard invitee fields plus custom answers (a1, a2, …) matching
 * the residential-cleaning event’s invitee question order.
 *
 * Verified via Calendly booking API (custom_fields positions):
 *   a1 = Phone Number
 *   a2 = Address of Service
 *   a3 = Payment walkthrough presence (not collected on site forms)
 *   a4 = Preferences / special requests (optional notes on quote form)
 *
 * Home details also go in utm_content for the internal calendar-details tool.
 */

import { CONTACT } from "@/constants.js";
import {
  fullNameFromLead,
  type CleaningLeadFormState,
} from "@/lib/cleaningLead";
import {
  getPpcAttribution,
  type PpcAttribution,
} from "@/helpers/ppcAttribution";

/** Standard Calendly invitee query params. */
export const CALENDLY_STANDARD_FIELD_MAP = {
  name: "name",
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
} as const;

/**
 * Custom invitee questions on the residential Calendly event
 * (https://calendly.com/golden-hour-cleaning-company/residential-cleaning).
 * Positions are 0-based in Calendly → a1, a2, …
 */
export const CALENDLY_CUSTOM_FIELD_MAP = {
  phone: "a1",
  address: "a2",
  notes: "a4",
} as const;

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;

export type BookingCalendlyInput = {
  form: CleaningLeadFormState;
  leadPath: "Personalized Quote" | "Book Online";
  baseUrl?: string;
  attribution?: PpcAttribution | null;
};

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
  baseUrl = CONTACT.bookingUrl,
  attribution = null,
}: BookingCalendlyInput): string {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    console.error("Invalid Calendly baseUrl:", baseUrl);
    return baseUrl;
  }

  const params = url.searchParams;
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const name = fullNameFromLead(form);
  const email = form.email.trim();
  const phone = form.mobilePhone.trim();
  const address = form.address.trim();
  const notes = form.notes.trim();

  // Event uses separated name format — set both full name and parts.
  if (name) params.set(CALENDLY_STANDARD_FIELD_MAP.name, name);
  if (firstName) params.set(CALENDLY_STANDARD_FIELD_MAP.firstName, firstName);
  if (lastName) params.set(CALENDLY_STANDARD_FIELD_MAP.lastName, lastName);
  if (email) params.set(CALENDLY_STANDARD_FIELD_MAP.email, email);

  const customValues: Record<string, string> = {
    phone,
    address,
    notes,
  };

  for (const [key, paramName] of Object.entries(CALENDLY_CUSTOM_FIELD_MAP)) {
    const value = customValues[key];
    if (paramName && value) params.set(paramName, value);
  }

  const attrs =
    attribution && typeof attribution === "object"
      ? attribution
      : typeof window !== "undefined"
        ? getPpcAttribution()
        : {};

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
    `bed=${form.bedrooms || ""}`,
    `ba=${form.bathrooms || ""}`,
    `sf=${form.homeSize.trim() || ""}`,
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
