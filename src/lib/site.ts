import { CITY_LANDING_PAGES } from "@/data/cityLandingPages";
import { CONTACT } from "@/constants.js";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goldenhourcleaningco.com";

export const BUSINESS_NAME = "Golden Hour Cleaning Co.";

export const BUSINESS_PHONE_DISPLAY = "(503) 893-4795";

/** Public mailing / business address already shown in the site footer. */
export const BUSINESS_ADDRESS = {
  streetAddress: "5441 S Macadam Ave. #4907",
  addressLocality: "Portland",
  addressRegion: "OR",
  postalCode: "97239",
  addressCountry: "US",
} as const;

/** City pages plus served cities that don't have their own landing page yet. */
const EXTRA_SERVICE_AREA_CITIES = ["Gresham"];

export const SERVICE_AREA_CITIES = [
  ...new Set([
    ...CITY_LANDING_PAGES.map(({ label }) => label),
    ...EXTRA_SERVICE_AREA_CITIES,
  ]),
];

export const BUSINESS_DESCRIPTION =
  "Professional residential and commercial cleaning serving Portland, Oregon and the surrounding Portland metro area. Licensed and locally owned.";

export const BUSINESS_LOGO_PATH = "/assets/Golden Hour - commercial.png";

export const CONTACT_PHONE_E164 = CONTACT.phone as string;
export const CONTACT_EMAIL = CONTACT.email as string;
