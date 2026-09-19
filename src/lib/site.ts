import { CITY_LANDING_PAGES } from "@/data/cityLandingPages";
import { CONTACT } from "@/constants.js";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goldenhourcleaningco.com";

export const BUSINESS_NAME = "Golden Hour Cleaning Co.";

export const BUSINESS_PHONE_DISPLAY = "(503) 893-4795";

/** Public mailing / business address already shown in the site footer. */
export const BUSINESS_ADDRESS = {
  streetAddress: "3400 NE John Olsen Avenue, Suite 200",
  addressLocality: "Hillsboro",
  addressRegion: "OR",
  postalCode: "97124",
  addressCountry: "US",
} as const;

export const SERVICE_AREA_CITIES = CITY_LANDING_PAGES.map(({ label }) => label);

export const BUSINESS_DESCRIPTION =
  "Professional residential and commercial cleaning serving Portland, Oregon and the surrounding Portland metro area. Licensed, insured, and locally owned.";

export const BUSINESS_LOGO_PATH = "/assets/Golden Hour - commercial.png";

export const CONTACT_PHONE_E164 = CONTACT.phone as string;
export const CONTACT_EMAIL = CONTACT.email as string;
