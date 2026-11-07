import type { Metadata } from "next";
import type { ServiceSlug } from "@/data/residentialServices";
import type { MarketConfig } from "@/lib/markets";

export const PORTLAND_METRO_AREAS = [
  "Portland",
  "Beaverton",
  "Hillsboro",
  "Tigard",
  "Lake Oswego",
  "Tualatin",
  "West Linn",
  "Oregon City",
  "Happy Valley",
  "Milwaukie",
  "Gresham",
  "Surrounding Portland metro communities",
] as const;

export function residentialServicePath(
  market: MarketConfig,
  slug: ServiceSlug,
): string {
  return residentialServicePathFromHub(market.servicesHubPath, slug);
}

export function residentialServicePathFromHub(
  servicesHubPath: MarketConfig["servicesHubPath"],
  slug: ServiceSlug,
): string {
  return `${servicesHubPath}/${slug}`;
}

export const PHOENIX_METRO_AREAS = [
  "Phoenix",
  "Scottsdale",
  "Tempe",
  "Paradise Valley",
  "Glendale",
  "Surrounding Phoenix metro communities",
] as const;

export function metroAreasForMarket(market: MarketConfig): string[] {
  return market.id === "phoenix"
    ? [...PHOENIX_METRO_AREAS]
    : [...PORTLAND_METRO_AREAS];
}

export type ServiceDetailLocale = {
  hero: Record<ServiceSlug, { title: string; intro: string }>;
  communitiesPhrase: string;
  areaShort: string;
  getStartedRegionLabel: string;
  pricingLandingHref: string;
  closingServiceAreaPhrase: string;
};

export function serviceDetailLocale(market: MarketConfig): ServiceDetailLocale {
  const isPhoenix = market.id === "phoenix";

  if (isPhoenix) {
    return {
      hero: {
        standard: {
          title: "Recurring House Cleaning in Phoenix & Scottsdale, Arizona",
          intro:
            "Our standard cleaning keeps a tidy Phoenix-metro home looking its best—ideal for recurring upkeep or homes professionally cleaned within the past 2–4 weeks.",
        },
        deep: {
          title: "Deep Cleaning Services in Phoenix & Scottsdale, Arizona",
          intro:
            "Our deep cleaning service is perfect when your Phoenix-area home needs a fresh start. We get into the details so you can enjoy a clean that feels brand new. Explore what's included and typical pricing below — or get started with a quote when you're ready.",
        },
        "move-out": {
          title: "Move-Out Cleaning Services in Phoenix & Scottsdale, Arizona",
          intro:
            "Our move-in/out cleaning is a detailed empty-home reset for Phoenix-metro homes—so you can hand over keys or settle in with a truly clean start.",
        },
      },
      communitiesPhrase:
        "Phoenix, Scottsdale, Tempe, and the surrounding metro area",
      areaShort: "Phoenix-area",
      getStartedRegionLabel: "the Phoenix metro",
      pricingLandingHref: market.ppcLandings.deepCleaning.path,
      closingServiceAreaPhrase:
        "Phoenix, Scottsdale, Tempe, and surrounding Arizona communities",
    };
  }

  return {
    hero: {
      standard: {
        title: "Recurring House Cleaning in Portland, Oregon",
        intro:
          "Our standard cleaning keeps a tidy Portland-area home looking its best—ideal for recurring upkeep or homes professionally cleaned within the past 2–4 weeks.",
      },
      deep: {
        title: "Deep Cleaning Services in Portland, Oregon",
        intro:
          "Our deep cleaning service is perfect when your Portland-area home needs a fresh start. We get into the details so you can enjoy a clean that feels brand new. Explore what's included and typical pricing below — or get started with a quote when you're ready.",
      },
      "move-out": {
        title: "Move-Out Cleaning Services in Portland, Oregon",
        intro:
          "Our move-in/out cleaning is a detailed empty-home reset for Portland and metro-area homes—so you can hand over keys or settle in with a truly clean start.",
      },
    },
    communitiesPhrase: "Portland and the surrounding communities",
    areaShort: "Portland-area",
    getStartedRegionLabel: "Portland",
    pricingLandingHref: market.ppcLandings.deepCleaning.path,
    closingServiceAreaPhrase: "Portland, OR and the surrounding Portland metro area",
  };
}

export function buildResidentialServiceMetadata(
  market: MarketConfig,
  slug: ServiceSlug,
): Metadata {
  const canonical = residentialServicePath(market, slug);
  const isPhoenix = market.id === "phoenix";
  const region = isPhoenix ? "Phoenix & Scottsdale" : "Portland";
  const state = isPhoenix ? "AZ" : "OR";

  if (slug === "standard") {
    return {
      title: isPhoenix
        ? `Recurring House Cleaning in ${region}, ${state} | Golden Hour Cleaning Co.`
        : "Recurring House Cleaning in Portland, OR | Golden Hour Cleaning Co.",
      description: isPhoenix
        ? "Dependable recurring house cleaning in Phoenix, Scottsdale, Tempe, and the metro area. Weekly, bi-weekly, or monthly maintenance cleaning with eco-friendly products and online scheduling."
        : "Dependable recurring house cleaning in Portland and the metro area. Weekly, bi-weekly, or monthly maintenance cleaning with eco-friendly products and online scheduling.",
      alternates: { canonical },
    };
  }

  if (slug === "deep") {
    return {
      title: isPhoenix
        ? `Deep Cleaning Services in ${region}, ${state} | Golden Hour Cleaning Co.`
        : "Deep Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description: isPhoenix
        ? "Professional deep house cleaning in Phoenix, Scottsdale, Tempe, and the metro area — what's included, typical starting prices, and how to request a personalized quote."
        : "Professional deep house cleaning in Portland and the metro area — what's included, typical starting prices, and how to request a personalized quote.",
      alternates: { canonical },
    };
  }

  if (slug === "move-out") {
    return {
      title: isPhoenix
        ? `Move-Out Cleaning Services in ${region}, ${state} | Golden Hour Cleaning Co.`
        : "Move-Out Cleaning Services in Portland, OR | Golden Hour Cleaning Co.",
      description: isPhoenix
        ? "Detailed move-in and move-out cleaning for empty homes in Phoenix, Scottsdale, Tempe, and the metro area. Cabinets, oven, fridge, and more. Request a personalized quote online."
        : "Detailed move-in and move-out cleaning for empty homes in Portland and the metro area. Cabinets, oven, fridge, and more. Request a personalized quote online.",
      alternates: { canonical },
    };
  }

  return {
    alternates: { canonical },
  };
}
