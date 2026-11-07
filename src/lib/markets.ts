import type { Metadata } from "next";
import { CONTACT } from "@/constants.js";
import { BUSINESS_ADDRESS, BUSINESS_NAME, SITE_URL } from "@/lib/site";

export type MarketContact = {
  phoneDisplay: string;
  phoneE164: string;
  smsE164: string;
};

const PORTLAND_CONTACT: MarketContact = {
  phoneDisplay: "(503) 893-4795",
  phoneE164: CONTACT.phone,
  smsE164: CONTACT.sms,
};

const PHOENIX_CONTACT: MarketContact = {
  phoneDisplay: "(928) 610-1311",
  phoneE164: "+19286101311",
  smsE164: "+19286101311",
};

export const MARKET_IDS = ["portland", "phoenix"] as const;
export type MarketId = (typeof MARKET_IDS)[number];

export type MarketConfig = {
  id: MarketId;
  /** Public path — primary SEO URL for this market home */
  path: "/" | "/phoenix";
  /** Residential services & pricing hub for this market */
  servicesHubPath: "/residential/services" | "/phoenix/services";
  aboutPath: "/about" | "/phoenix/about";
  commercialPath: "/commercial" | "/phoenix/commercial";
  commercial: {
    seoTitle: string;
    seoDescription: string;
    /** City/region name in hero H1, e.g. Portland or Phoenix */
    heroCityLabel: string;
    heroSupporting: string;
    communitySidebarTitle: string;
  };
  servicesHub: {
    title: string;
    intro: string;
    seoTitle: string;
    seoDescription: string;
  };
  /** Short label for UI, e.g. location selector */
  displayLabel: string;
  /** Hero eyebrow — keep emoji + styling-friendly text */
  heroLocationEyebrow: string;
  primaryCityLabel: string;
  regionLabel: string;
  stateName: string;
  /** Suggested locale for lightweight geo hints (ISO 3166-2 where applicable) */
  suggestedRegionCodes: string[];
  seo: {
    title: string;
    description: string;
    /** Relative canonical path */
    canonicalPath: string;
    openGraphTitle: string;
    openGraphDescription: string;
  };
  hero: {
    headline: string;
    supporting: string;
  };
  serviceArea: {
    /** One-line list for map section and header marquee */
    citiesLine: string;
    mapTitle: string;
    /** Shaded service-area map (Google Maps + GeoJSON) */
    map?: {
      geoJsonUrl: string;
      center: { lat: number; lng: number };
      initialZoom: number;
      /** When set, keep ArcGIS `CITYNAME` features only (Portland). */
      cityNames?: string[];
    };
    /** Optional second line under cities (e.g. ZIP list). */
    zipCodesLine?: string;
  };
  headerMarqueeItems: string[];
  servicesPreviewSupporting: string;
  reviews: {
    /** Portland Places-backed reviews only today */
    googlePlaceSource: "portland";
    carouselTitle: string;
    carouselSubtitle?: string;
    /** When reusing Portland review bodies on another market page */
    portfolioAttributionNote?: string;
    /** Hide aggregate rating/count when it would misrepresent the local GBP */
    showAggregateFromGoogle: boolean;
  };
  /** Passed to ResidentialPricingGuide as homeLocation: "your {value} home" */
  pricingHomeDescriptor?: string;
  footer: {
    blurb: string;
    licenseNote: string;
    mailingAddress: {
      street: string;
      cityStateZip: string;
    };
  };
  contact: MarketContact;
  ppcLandings: {
    deepCleaning: {
      path: string;
      seoTitle: string;
      seoDescription: string;
    };
    moveOut: {
      path: string;
      seoTitle: string;
      seoDescription: string;
    };
  };
};

const SHARED_MARQUEE_TAIL = [
  "We use eco-friendly products",
  "Vetted professionals",
  "Flexible weekly • bi-weekly • monthly",
  "Same-week openings available",
  "Easy online booking",
  "Locally owned & operated",
  "Women owned & operated",
] as const;

const PORTLAND_CITIES_LINE =
  "Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin • Happy Valley • Clackamas • Hillsboro • Oregon City • Gresham";

const PHOENIX_CITIES_LINE =
  "Phoenix • Scottsdale • Tempe • Paradise Valley • and surrounding communities";

/** Source of truth — regenerate `public/geo/phoenix-service-zips.geojson` via `npm run geo:phoenix-zips`. */
export const PHOENIX_SERVICE_ZIP_CODES = [
  "85003",
  "85008",
  "85012",
  "85013",
  "85014",
  "85016",
  "85018",
  "85020",
  "85021",
  "85022",
  "85028",
  "85032",
  "85050",
  "85250",
  "85251",
  "85253",
  "85254",
  "85257",
  "85258",
  "85260",
  "85281",
  "85288",
] as const;

const PHOENIX_ZIP_CODES_LINE = PHOENIX_SERVICE_ZIP_CODES.join(" · ");

const PORTLAND_MAP_CITY_NAMES = [
  "Portland",
  "Beaverton",
  "Tigard",
  "Lake Oswego",
  "West Linn",
  "Milwaukie",
  "Tualatin",
  "Happy Valley",
  "Clackamas",
  "Hillsboro",
  "Oregon City",
  "Gresham",
] as const;

const PORTLAND_BOUNDARIES_GEOJSON_URL =
  "https://gis-pdx.opendata.arcgis.com/datasets/PDX::city-boundaries.geojson?outSR=4326";

export const MARKETS: Record<MarketId, MarketConfig> = {
  portland: {
    id: "portland",
    path: "/",
    servicesHubPath: "/residential/services",
    aboutPath: "/about",
    commercialPath: "/commercial",
    commercial: {
      seoTitle: "Commercial Cleaning in Portland, OR | Golden Hour Cleaning Co.",
      seoDescription:
        "Reliable commercial cleaning for offices, studios, and boutique businesses in Portland and the surrounding metro area from Golden Hour Cleaning Co.",
      heroCityLabel: "Portland",
      heroSupporting:
        "Professional commercial cleaning for offices, studios, and boutique businesses throughout Portland and the surrounding metro area. Consistent, trustworthy, and detail-oriented service for spaces that deserve to shine.",
      communitySidebarTitle:
        "We care about the businesses that make Portland thrive.",
    },
    servicesHub: {
      title: "House Cleaning Services in Portland, Oregon",
      intro:
        "Thoughtful, detail-driven cleaning for homes throughout Portland and the surrounding metro area. From consistent upkeep to comprehensive resets, each service is designed around your space, your needs, and the level of care your home requires.",
      seoTitle: "House Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      seoDescription:
        "Compare residential cleaning services and starting prices from Golden Hour Cleaning Co. — standard, deep, and move-out cleaning for homes throughout Portland and the metro area.",
    },
    displayLabel: "Portland-metro area",
    heroLocationEyebrow: "📍 Portland-metro area",
    primaryCityLabel: "Portland, OR",
    regionLabel: "Portland metro area",
    stateName: "Oregon",
    suggestedRegionCodes: ["US-OR"],
    seo: {
      title: "Golden Hour Cleaning Co. | House Cleaning in Portland, OR",
      description:
        "Golden Hour Cleaning Co. provides professional house cleaning in Portland, OR and the surrounding metro area — meticulous care, transparent pricing, and easy online booking.",
      canonicalPath: "/",
      openGraphTitle: "Golden Hour Cleaning Co. | House Cleaning in Portland, OR",
      openGraphDescription:
        "Professional house cleaning in Portland, Oregon and the surrounding metro area. Licensed and locally owned — deep cleans, recurring care, and move-out cleaning.",
    },
    hero: {
      headline:
        "Professional house cleaning in Portland, Oregon — high standards, intentional care & consistent results.",
      supporting:
        "Meticulous, non-toxic cleaning with thoughtful service, transparent pricing, and easy online booking.",
    },
    serviceArea: {
      citiesLine: PORTLAND_CITIES_LINE,
      mapTitle: "Our service area",
      map: {
        geoJsonUrl: PORTLAND_BOUNDARIES_GEOJSON_URL,
        center: { lat: 45.48, lng: -122.68 },
        initialZoom: 10,
        cityNames: [...PORTLAND_MAP_CITY_NAMES],
      },
    },
    headerMarqueeItems: [
      `Serving: ${PORTLAND_CITIES_LINE}`,
      ...SHARED_MARQUEE_TAIL,
    ],
    contact: PORTLAND_CONTACT,
    servicesPreviewSupporting:
      "From recurring home care to move-out details and commercial spaces — professional cleaning for homes and businesses throughout Portland and the surrounding metro area.",
    reviews: {
      googlePlaceSource: "portland",
      carouselTitle: "What our clients say",
      carouselSubtitle: "Our reviews on Google",
      showAggregateFromGoogle: true,
    },
    footer: {
      blurb:
        "Meticulous care, mindful presence, and eco-friendly products — professional house cleaning for Portland, Oregon and the surrounding metro area.",
      licenseNote:
        "Golden Hour Cleaning Co is licensed in the State of Oregon.",
      mailingAddress: {
        street: BUSINESS_ADDRESS.streetAddress,
        cityStateZip: `${BUSINESS_ADDRESS.addressLocality}, ${BUSINESS_ADDRESS.addressRegion} ${BUSINESS_ADDRESS.postalCode}`,
      },
    },
    ppcLandings: {
      deepCleaning: {
        path: "/portland-deep-cleaning",
        seoTitle: "Deep Cleaning Services in Portland, OR | Get a Quote or Call",
        seoDescription:
          "Portland deep house cleaning with starting prices online. Call (503) 893-4795, request a personalized quote, or reserve your deep clean. Licensed and locally owned.",
      },
      moveOut: {
        path: "/portland-move-out-cleaning",
        seoTitle: "Move-Out Cleaning Services in Portland, OR | Get a Quote or Call",
        seoDescription:
          "Portland move-out and move-in house cleaning with starting prices online. Call (503) 893-4795, request a personalized quote, or reserve your move-out clean. Licensed and locally owned.",
      },
    },
  },
  phoenix: {
    id: "phoenix",
    path: "/phoenix",
    servicesHubPath: "/phoenix/services",
    aboutPath: "/phoenix/about",
    commercialPath: "/phoenix/commercial",
    commercial: {
      seoTitle:
        "Commercial Cleaning in Phoenix & Scottsdale AZ | Golden Hour Cleaning Co.",
      seoDescription:
        "Reliable commercial cleaning for offices, studios, and boutique businesses in Phoenix, Scottsdale, Tempe, and the surrounding metro area from Golden Hour Cleaning Co.",
      heroCityLabel: "Phoenix",
      heroSupporting:
        "Professional commercial cleaning for offices, studios, and boutique businesses throughout Phoenix, Scottsdale, Tempe, and the surrounding metro area. Consistent, trustworthy, and detail-oriented service for spaces that deserve to shine.",
      communitySidebarTitle:
        "We care about the businesses that help the Valley thrive.",
    },
    servicesHub: {
      title: "House Cleaning Services in Phoenix & Scottsdale",
      intro:
        "Thoughtful, detail-driven cleaning for homes throughout Phoenix and the surrounding metro area. From consistent upkeep to comprehensive resets, each service is designed around your space, your needs, and the level of care your home requires.",
      seoTitle:
        "House Cleaning Services in Phoenix & Scottsdale AZ | Golden Hour Cleaning Co.",
      seoDescription:
        "Compare recurring, deep, and move-in/out house cleaning and starting prices for the Phoenix metro from Golden Hour Cleaning Co.",
    },
    displayLabel: "Phoenix-metro area",
    heroLocationEyebrow: "📍 Phoenix-metro area",
    primaryCityLabel: "Phoenix, AZ",
    regionLabel: "Phoenix metro area",
    stateName: "Arizona",
    suggestedRegionCodes: ["US-AZ"],
    seo: {
      title: "House Cleaning Phoenix & Scottsdale AZ | Golden Hour Cleaning Co.",
      description:
        "Professional house cleaning in Phoenix, Scottsdale, Tempe, and surrounding areas. Explore recurring cleaning, deep cleaning, and move-in/out cleaning with Golden Hour Cleaning Co.",
      canonicalPath: "/phoenix",
      openGraphTitle: "House Cleaning Phoenix & Scottsdale AZ | Golden Hour Cleaning Co.",
      openGraphDescription:
        "Professional house cleaning in Phoenix, Scottsdale, Tempe, and surrounding areas. Recurring, deep, and move-in/out cleaning — transparent pricing and easy online booking.",
    },
    hero: {
      headline:
        "Professional house cleaning in Phoenix & Scottsdale — high standards, intentional care & consistent results.",
      supporting:
        "Meticulous, non-toxic cleaning with thoughtful service, transparent pricing, and easy online booking.",
    },
    serviceArea: {
      citiesLine: PHOENIX_CITIES_LINE,
      mapTitle: "Where we’re scheduling in the Phoenix area",
      zipCodesLine: PHOENIX_ZIP_CODES_LINE,
      map: {
        geoJsonUrl: "/geo/phoenix-service-zips.geojson",
        center: { lat: 33.48, lng: -112.05 },
        initialZoom: 9,
      },
    },
    headerMarqueeItems: [
      `Serving: ${PHOENIX_CITIES_LINE}`,
      ...SHARED_MARQUEE_TAIL,
    ],
    contact: PHOENIX_CONTACT,
    servicesPreviewSupporting:
      "From recurring home care to move-out details and commercial spaces — we’re expanding our same residential and light commercial standards to homes and businesses across the Phoenix metro.",
    reviews: {
      googlePlaceSource: "portland",
      carouselTitle: "What our clients say",
      carouselSubtitle: undefined,
      portfolioAttributionNote:
        "We’re proud of the trust our clients place in us. Here’s what they have to say about their experience with Golden Hour Cleaning Co.",
      showAggregateFromGoogle: false,
    },
    pricingHomeDescriptor: "Phoenix-area",
    footer: {
      blurb:
        "Meticulous care, mindful presence, and eco-friendly products — professional house cleaning for Phoenix, Scottsdale, and the surrounding metro area.",
      licenseNote:
        "Golden Hour Cleaning Co. is a trade name of Heart Aligned Wellness LLC, authorized to do business in the State of Arizona.",
      mailingAddress: {
        street: "4539 N 22ND St. #7933",
        cityStateZip: "Phoenix, AZ 85016",
      },
    },
    ppcLandings: {
      deepCleaning: {
        path: "/phoenix-deep-cleaning",
        seoTitle:
          "Deep Cleaning Services in Phoenix & Scottsdale AZ | Get a Quote or Call",
        seoDescription:
          "Phoenix-metro deep house cleaning with starting prices online. Call (928) 610-1311, request a personalized quote, or reserve your deep clean.",
      },
      moveOut: {
        path: "/phoenix-move-out-cleaning",
        seoTitle:
          "Move-Out Cleaning Services in Phoenix & Scottsdale AZ | Get a Quote or Call",
        seoDescription:
          "Phoenix-metro move-out and move-in house cleaning with starting prices online. Call (928) 610-1311, request a personalized quote, or reserve your move-out clean.",
      },
    },
  },
};

export function getMarketById(id: MarketId): MarketConfig {
  return MARKETS[id];
}

export function getMarketIdFromPath(pathname: string): MarketId | null {
  if (pathname.startsWith("/phoenix")) return "phoenix";
  if (pathname === "/" || pathname === "") return "portland";
  if (
    pathname.startsWith("/residential") ||
    pathname.startsWith("/cities/") ||
    pathname.startsWith("/portland-")
  ) {
    return "portland";
  }
  return null;
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/Golden%20Hour%20-%20commercial.png`;

export function buildMarketMetadata(market: MarketConfig): Metadata {
  const url = `${SITE_URL}${market.seo.canonicalPath === "/" ? "" : market.seo.canonicalPath}`;
  return {
    title: market.seo.title,
    description: market.seo.description,
    alternates: { canonical: market.seo.canonicalPath },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: BUSINESS_NAME,
      title: market.seo.openGraphTitle,
      description: market.seo.openGraphDescription,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: BUSINESS_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: market.seo.openGraphTitle,
      description: market.seo.openGraphDescription,
    },
  };
}
