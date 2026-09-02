/** Frozen Sept 2026 — used only by PreservedQuoteCalculator. Do not import elsewhere. */

export const CFG = {
  frequencyDiscount: { weekly: 0.18, bi_weekly: 0.12, monthly: 0.05, one_time: 0.0 },
  roomsToSqft: { perBathroom: 150 },
  promos: {
    GOLDENWELCOME: { amount: 50, level: "deep" },
  },
};

export const WALKTHROUGH_ARRIVAL_HOURS = 2;

export const LEVEL_COPY = {
  standard: { name: "Standard Clean", rateLabel: "Standard rate" },
  deep: { name: "Deep Clean", rateLabel: "Deep Clean rate" },
  move_out: { name: "Move-Out", rateLabel: "Move-Out rate" },
};

export const CONTACT = {
  bookingUrl:
    "https://calendly.com/golden-hour-cleaning-company/residential-cleaning",
  phone: "+15038934795",
  sms: "+15038934795",
  email: "golden.hour.cleaning.company@gmail.com",
};
