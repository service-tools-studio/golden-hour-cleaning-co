/** Internal quote calculator only — do not import from public pages. */

export const CFG = {
  frequencyDiscount: { weekly: 0.18, bi_weekly: 0.12, monthly: 0.05, one_time: 0.0 },
  roomsToSqft: { perBathroom: 150 },
  // Promo UI removed; keep empty map for any residual validation paths.
  promos: {},
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
