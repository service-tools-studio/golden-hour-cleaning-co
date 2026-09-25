/**
 * Canonical FAQ answers shared across public pages.
 * Pages may use different question wording for context, but the same topic
 * key must always use the same answer.
 */

export type SiteFaq = {
  question: string;
  answer: string;
};

export const FAQ_ANSWERS = {
  hourly:
    "We don't charge by the hour. Our pricing is based on the size, condition and scope of your home, so you're paying for the completed cleaning—not how long it takes us to get there.\n\nOur experienced team works efficiently, and we don't believe you should pay more simply because a cleaning takes longer—or that our team's efficiency should make the service worth less. Your quoted price reflects completion of the agreed-upon cleaning scope, regardless of the exact time required.",

  supplies:
    "Yes. We use eco-friendly products whenever possible. For heavy buildup, stronger conventional products may be used when needed. Our team arrives with professional-grade products and equipment. If you have product preferences, let us know.",

  beHome:
    "Not necessarily. Many clients provide secure access while they're away — for example a garage code, lockbox, or key. We'll coordinate access details with you before your appointment.",

  insured:
    "Yes. Golden Hour Cleaning Co. is licensed and insured in Oregon.",

  deepPricing:
    "You can review starting prices by home size on this page, then request a personalized quote based on number of bedrooms, bathrooms, square footage, and any add-ons. For a typical Portland home, we'll send you a broad range quote rather than a single number because condition affects the work required. We confirm your final price after an in-person walkthrough, right before cleaning begins.",

  standardPricing:
    "You can review starting prices by home size on this page, then request a personalized quote based on number of bedrooms, bathrooms, square footage, and any add-ons. We confirm your final price after an in-person walkthrough, right before cleaning begins.",

  moveOutPricing:
    "You can review starting prices by home size on this page, then request a personalized quote based on number of bedrooms, bathrooms, square footage, and any add-ons. We confirm your final price after an in-person walkthrough, right before cleaning begins.",

  finalPriceConfirmed:
    "We assess the home during your walkthrough and confirm the final price before cleaning begins. You'll know the exact amount before we start.",

  reserveBeforeEstimate:
    "Yes. You can reserve your deep clean anytime, and after you submit a personalized quote request you'll also see an option to pick an available time. We'll still confirm your final price with you before cleaning begins.",

  deepIncluded:
    "A deep clean includes kitchens, bathrooms, bedrooms, living areas, and detailed work throughout the home — baseboards, window sills, light switches, reachable trim, edges, and more. See the full checklist above.",

  recurringAfterDeep:
    "Yes. Many clients begin with a deep clean, then move to recurring standard cleaning. We can help you plan that after your first visit.",

  deepDuration:
    "On-site time varies with your home's size and condition. We schedule enough cleaners to keep visits efficient (typically up to about 4 hours on site), and you'll see a time estimate with your quote.",

  standardDuration:
    "On-site time varies with your home's size and condition. We schedule enough cleaners to keep visits efficient, and you'll see an estimate when you get your quote.",

  generalDuration:
    "On-site time varies with your home's size and condition. We schedule enough cleaners to keep visits efficient, and you'll see an estimated timeframe when you get your quote.",

  deepHowOften:
    "Many homeowners schedule a deep cleaning once or twice a year. Others begin with a deep cleaning and then maintain their home with recurring standard cleaning services.",

  standardHowOften:
    "Most homeowners choose bi-weekly service, while others prefer weekly or monthly visits depending on their household and lifestyle.",

  standardWhoFor:
    "Standard cleans are reserved for recurring customers or homes that have had a professional cleaning within the past 2–4 weeks. If it's been longer, we usually recommend starting with a Deep Clean.",

  moveOutEmptyHome:
    "For the most thorough results, we recommend the home be completely empty or nearly empty before our arrival. This allows us to clean every accessible surface efficiently.",

  moveOutCabinets:
    "Yes. For move-in and move-out cleanings, we clean the interiors of empty cabinets and drawers.",

  moveOutOven:
    "Yes. Cleaning the inside of the oven is included in our move-in and move-out cleaning service.",

  moveOutFridge:
    "Yes. Cleaning the inside of the refrigerator is included in our move-in and move-out cleaning service.",

  howToGetQuote:
    "Simply visit our website to request a personalized quote and book your cleaning online. If you'd rather speak with someone, our Golden Hour Cleaning Co. team is happy to answer your questions and help schedule your service.",

  recurringOffered:
    "Yes. We offer weekly, biweekly, and custom recurring cleaning options.",

  apartmentsCondos:
    "Yes. We clean houses, apartments, condos, townhomes, and residential properties throughout the Portland metro area.",
} as const;

export type FaqAnswerKey = keyof typeof FAQ_ANSWERS;

/** Build a FAQ pair; optional question override for page-specific wording. */
export function siteFaq(
  key: FaqAnswerKey,
  question: string,
): SiteFaq {
  return { question, answer: FAQ_ANSWERS[key] };
}

export const HOURLY_CHARGE_FAQ: SiteFaq = siteFaq(
  "hourly",
  "What do you charge hourly?",
);

export const SUPPLIES_FAQ: SiteFaq = siteFaq(
  "supplies",
  "Do you bring your own cleaning supplies?",
);

export const BE_HOME_FAQ: SiteFaq = siteFaq(
  "beHome",
  "Do I need to be home during the cleaning?",
);

export const INSURED_FAQ: SiteFaq = siteFaq("insured", "Are you insured?");

export const DEEP_PRICING_FAQ: SiteFaq = siteFaq(
  "deepPricing",
  "How is deep cleaning priced?",
);

export const STANDARD_PRICING_FAQ: SiteFaq = siteFaq(
  "standardPricing",
  "How is standard cleaning priced?",
);

export const MOVE_OUT_PRICING_FAQ: SiteFaq = siteFaq(
  "moveOutPricing",
  "How is move-in / move-out cleaning priced?",
);

/** City cost FAQ — same pricing model, localized city name in the question. */
export function cityHouseCleaningCostFaq(city: string): SiteFaq {
  return {
    question: `How much does house cleaning cost in ${city}?`,
    answer:
      "You can review starting prices by home size on our services pages, then request a personalized quote based on number of bedrooms, bathrooms, square footage, and any add-ons. For a typical home, we'll send you a broad range quote rather than a single number because condition affects the work required. We confirm your final price after an in-person walkthrough, right before cleaning begins.",
  };
}

export function cityRecurringFaq(areaLabel: string): SiteFaq {
  return {
    question: "Do you offer recurring cleaning?",
    answer: `${FAQ_ANSWERS.recurringOffered} Our recurring options are available for ${areaLabel}.`,
  };
}

export function cityApartmentsFaq(areaLabel: string): SiteFaq {
  return {
    question: "Do you clean apartments and condos?",
    answer: `Yes. We clean houses, apartments, condos, townhomes, and residential properties throughout ${areaLabel}.`,
  };
}
