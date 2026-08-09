/** URL slug → calculator clean-type key */
export const SERVICE_SLUGS = ["standard", "deep", "move-out"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ServiceLevelKey = "standard" | "deep" | "move_out";

export type ResidentialService = {
  slug: ServiceSlug;
  levelKey: ServiceLevelKey;
  title: string;
  desc: string;
  price: string;
  featured?: boolean;
  items: string[];
  overview: string;
  bestFor: string[];
};

export const RESIDENTIAL_SERVICES: Record<ServiceSlug, ResidentialService> = {
  standard: {
    slug: "standard",
    levelKey: "standard",
    title: "Standard Clean",
    desc: "Recurring upkeep for homes that already feel pretty tidy — or that have been professionally cleaned within the past 2–4 weeks.",
    price: "~$0.14–$0.20/sq ft • lighter upkeep",
    items: [
      "Kitchen & bath surfaces",
      "Dusting & high-touch areas",
      "Floors vacuum & mop",
      "Light general tidy",
    ],
    overview:
      "Our Standard Clean keeps your home feeling fresh between deeper resets. We focus on the surfaces and spaces you use every day — kitchens, bathrooms, floors, and high-touch areas. We use eco-friendly products whenever possible;. Bathrooms are priced at a higher rate because they need denser care. Quotes are based on square footage; we confirm your final price after a quick walkthrough.",
    bestFor: [
      "Recurring weekly, bi-weekly, or monthly customers",
      "Homes professionally cleaned within the past 2–4 weeks",
      "Maintenance between deep cleans",
    ],
  },
  deep: {
    slug: "deep",
    levelKey: "deep",
    title: "Deep Clean",
    desc: "A full-home reset — perfect if it’s been 2+ months since last clean or things feel built up.",
    price: "~$0.26–$0.40/sq ft • full-home reset",
    featured: true,
    items: [
      "Baseboards & edges",
      "Bathroom detailing",
      "Kitchen detail + appliance exteriors",
      "Doors & door frames",
      "Light switches & outlets",
      "Fan dusting",
      "Spot wall wipe",
    ],
    overview:
      "A Deep Clean is our most popular starting point — a thorough top-to-bottom refresh when dust, grime, or life has built up. We go beyond upkeep with detailed attention to edges, bathrooms, kitchens, and the spots easy to miss in day-to-day cleaning. Pricing is by the square foot ($0.26–$0.40), bathrooms are priced at a higher rate for denser care, and we use eco-friendly products whenever possible (conventional products may be used for heavy buildup when needed). Your final price within the range is confirmed after a quick walkthrough based on condition.",
    bestFor: [
      "First-time clients or seasonal resets",
      "Homes that haven’t been professionally cleaned in 2+ months",
      "Preparing for guests or a fresh routine",
    ],
  },
  "move-out": {
    slug: "move-out",
    levelKey: "move_out",
    title: "Move-Out",
    desc: "Empty-home detail clean so you can move in (or hand over keys) feeling completely clear.",
    price: "~$0.40–$0.50/sq ft • most intensive",
    items: [
      "Everything in Deep Clean, plus:",
      "Inside cabinets & drawers",
      "Closet shelves",
      "Baseboards (full detail)",
      "Doors + door frames",
      "Light switches / outlets",
      "Fan dusting",
      "Full bathroom sanitation",
      "Floor detail",
      "Light fixture dusting",
    ],
    overview:
      "Move-In / Move-Out cleaning is our most intensive service — designed for empty homes when every cabinet, closet, and corner needs to shine. Pricing is by the square foot ($0.40–$0.50), bathrooms are priced at a higher rate for denser care, and we use eco-friendly products whenever possible (conventional products may be used for heavy buildup when needed). We confirm your final price after a quick walkthrough. Ideal before handing over keys or settling into a new space with a truly clean start.",
    bestFor: [
      "Move-out inspections and key handoffs",
      "Move-in preparation",
      "Empty or nearly empty homes",
    ],
  },
};

export function isServiceSlug(value: string): value is ServiceSlug {
  return SERVICE_SLUGS.includes(value as ServiceSlug);
}

export function getServiceBySlug(slug: string): ResidentialService | undefined {
  return isServiceSlug(slug) ? RESIDENTIAL_SERVICES[slug] : undefined;
}

export const SERVICE_LIST = SERVICE_SLUGS.map((slug) => RESIDENTIAL_SERVICES[slug]);
