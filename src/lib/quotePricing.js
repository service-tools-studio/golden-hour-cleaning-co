import { CFG, WALKTHROUGH_ARRIVAL_HOURS } from "../constants.js";

/**
 * Shared Golden Hour quote math.
 *
 * Production UI remains in QuoteCalculator.jsx (untouched Calendly popup flow).
 * This module mirrors that calculation so the PPC landing page can reuse pricing
 * without changing `/`, `/residential/quote`, or `/residential/services`.
 */

const DEEP_RATE_PER_SQFT_LOW = 0.26;
const DEEP_RATE_PER_SQFT_HIGH = 0.40;
const DEEP_SQFT_PER_HOUR_FAST = 90 / DEEP_RATE_PER_SQFT_LOW;
const DEEP_SQFT_PER_HOUR_SLOW = 225;

const RATE_PER_SQFT = {
  standard: { low: 0.14, high: 0.2 },
  deep: { low: DEEP_RATE_PER_SQFT_LOW, high: DEEP_RATE_PER_SQFT_HIGH },
  move_out: { low: 0.4, high: 0.5 },
};

const BATH_RATE_PER_SQFT = {
  standard: { low: 0.22, high: 0.4 },
  deep: { low: DEEP_RATE_PER_SQFT_LOW * 2, high: DEEP_RATE_PER_SQFT_HIGH * 2 },
  move_out: { low: 0.8, high: 1.0 },
};

const SQFT_PER_HOUR = {
  standard: { fast: 290 / 0.8, slow: 290 / 0.8 },
  deep: { fast: DEEP_SQFT_PER_HOUR_FAST, slow: DEEP_SQFT_PER_HOUR_SLOW },
  move_out: { fast: 225, slow: 180 },
};

const MIN_VISIT_HOURS_ONE_CLEANER = 2;
const MAX_ON_SITE_HOURS = 4;

const MIN_CHARGE_BY_TYPE = {
  standard: 150,
  deep: 250,
  move_out: 350,
};

const MAX_TOTAL_PERSON_HOURS = 16;

export const ADDON_FRIDGE_PRICE = 60;
const ADDON_FRIDGE_HOURS_LOW = 0.5;
const ADDON_FRIDGE_HOURS_HIGH = 1.25;

export const ADDON_OVEN_PRICE = 60;
const ADDON_OVEN_HOURS_LOW = 0.5;
const ADDON_OVEN_HOURS_HIGH = 1.25;

export const ADDON_SECOND_KITCHEN_FEE_LOW = 75;
export const ADDON_SECOND_KITCHEN_FEE_HIGH = 200;
const ADDON_SECOND_KITCHEN_HOURS_LOW = 1;
const ADDON_SECOND_KITCHEN_HOURS_HIGH = 1.5;

const FULL_BATH_SQFT = CFG.roomsToSqft.perBathroom;
const BATH_TIME_MULTIPLIER = 1.5;

function snapBathroomUnits(bathrooms) {
  const n = Number.isFinite(Number(bathrooms)) ? Number(bathrooms) : 0;
  return Math.max(0, Math.round(n * 2) / 2);
}

function fullBathPersonHours(sqftPerHour, timeMultiplier = 1) {
  return (FULL_BATH_SQFT / sqftPerHour) * timeMultiplier;
}

function clampCurrency(n) {
  return Math.max(0, Math.round(n));
}

function roundTo(n, step = 0.5) {
  return Math.round(n / step) * step;
}

function trimHours(h) {
  const s = h.toFixed(1);
  return s.endsWith(".0") ? String(Math.round(h)) : s;
}

function hoursUnit(h) {
  return Math.abs(h - 1) < 1e-9 ? "hour" : "hours";
}

export function sqftHeuristicForBedrooms(bedrooms) {
  const n = Math.max(0, Math.floor(Number(bedrooms) || 0));
  if (n <= 0) return 0;
  if (n === 1) return 1000;
  if (n === 2) return 1100;
  if (n === 3) return 1500;
  if (n === 4) return 1900;
  return 2200;
}

export function splitConditionBands(low, high) {
  const lo = Math.round(Number(low) || 0);
  const hi = Math.round(Number(high) || 0);
  if (hi <= lo) return null;
  const span = hi - lo;
  const third = Math.max(1, Math.floor(span / 3));
  const lightHigh = Math.min(lo + third - 1, hi - 2);
  const modLow = lightHigh + 1;
  const modHigh = Math.min(modLow + third - 1, hi - 1);
  return [
    { id: "light", low: lo, high: lightHigh },
    { id: "moderate", low: modLow, high: modHigh },
    { id: "heavy", low: modHigh + 1, high: hi },
  ];
}

export function calculateQuote({
  bedrooms,
  bathrooms,
  sqft,
  cleanType = "deep",
  promoValid = false,
  includeFridge = false,
  includeOven = false,
  includeSecondKitchen = false,
}) {
  const safeSqftInput = Math.max(
    0,
    Number.isFinite(Number(sqft)) ? Number(sqft) : 0
  );

  const bathroomUnits = snapBathroomUnits(bathrooms);

  const hasBedroomHeuristic = bedrooms > 0;
  const estSqft = sqftHeuristicForBedrooms(bedrooms);

  const rates = RATE_PER_SQFT[cleanType] ?? RATE_PER_SQFT.deep;
  const productivity = SQFT_PER_HOUR[cleanType] ?? SQFT_PER_HOUR.deep;
  const ratePerSqftLow = rates.low;
  const ratePerSqftHigh = rates.high;

  let sqftLow;
  let sqftHigh;

  if (safeSqftInput <= 0) {
    sqftLow = hasBedroomHeuristic ? estSqft : 0;
    sqftHigh = hasBedroomHeuristic ? estSqft : 0;
  } else {
    sqftLow = safeSqftInput;
    sqftHigh = safeSqftInput;
  }

  const bathAreaSqft = Math.round(bathroomUnits * FULL_BATH_SQFT);
  const bathsDominateHome =
    bathAreaSqft > 0 && bathAreaSqft >= Math.max(sqftLow, sqftHigh, 1);
  const bathTimeMultiplier = bathsDominateHome ? BATH_TIME_MULTIPLIER : 1;
  const bathPersonHoursLow =
    bathroomUnits * fullBathPersonHours(productivity.fast, bathTimeMultiplier);
  const bathPersonHoursHigh =
    bathroomUnits *
    fullBathPersonHours(productivity.slow, bathTimeMultiplier);

  let addonHoursLow = bathPersonHoursLow;
  let addonHoursHigh = bathPersonHoursHigh;
  let addonFlat = 0;
  let secondKitchenFeeLow = 0;
  let secondKitchenFeeHigh = 0;

  const moveOutIncludesFridgeOven = cleanType === "move_out";

  if (includeFridge && !moveOutIncludesFridgeOven) {
    addonHoursLow += ADDON_FRIDGE_HOURS_LOW;
    addonHoursHigh += ADDON_FRIDGE_HOURS_HIGH;
    addonFlat += ADDON_FRIDGE_PRICE;
  }

  if (includeOven && !moveOutIncludesFridgeOven) {
    addonHoursLow += ADDON_OVEN_HOURS_LOW;
    addonHoursHigh += ADDON_OVEN_HOURS_HIGH;
    addonFlat += ADDON_OVEN_PRICE;
  }

  if (includeSecondKitchen) {
    addonHoursLow += ADDON_SECOND_KITCHEN_HOURS_LOW;
    addonHoursHigh += ADDON_SECOND_KITCHEN_HOURS_HIGH;
    secondKitchenFeeLow = ADDON_SECOND_KITCHEN_FEE_LOW;
    secondKitchenFeeHigh = ADDON_SECOND_KITCHEN_FEE_HIGH;
  }

  const billableHoursLowRaw = Math.max(
    MIN_VISIT_HOURS_ONE_CLEANER,
    sqftLow / productivity.fast + addonHoursLow
  );
  const billableHoursHighRaw = Math.max(
    MIN_VISIT_HOURS_ONE_CLEANER,
    sqftHigh / productivity.slow + addonHoursHigh
  );

  const cleaners = Math.max(
    1,
    Math.ceil(billableHoursHighRaw / MAX_ON_SITE_HOURS)
  );

  const onSiteRangeLowRaw = billableHoursLowRaw / cleaners;
  const onSiteRangeHighRaw = billableHoursHighRaw / cleaners;

  const onSiteRangeLow = roundTo(onSiteRangeLowRaw, 0.5);
  const onSiteRangeHigh = roundTo(onSiteRangeHighRaw, 0.5);

  const billableHoursLow = onSiteRangeLow * cleaners;
  const billableHoursHigh = onSiteRangeHigh * cleaners;

  const totalPersonHoursHigh = billableHoursHigh;
  const isLargeJob = totalPersonHoursHigh > MAX_TOTAL_PERSON_HOURS;

  const hasTimeRange =
    Math.abs(onSiteRangeHigh - onSiteRangeLow) >= 0.26 ||
    Math.abs(billableHoursHigh - billableHoursLow) >= 0.26;

  const timeDisplayText = !hasTimeRange
    ? `~${trimHours(onSiteRangeHigh)} ${hoursUnit(onSiteRangeHigh)}`
    : `${trimHours(onSiteRangeLow)}–${trimHours(
        onSiteRangeHigh
      )} ${hoursUnit(onSiteRangeHigh)}`;

  const bathRates = BATH_RATE_PER_SQFT[cleanType] ?? BATH_RATE_PER_SQFT.deep;
  const bathRateLow = bathRates.low;
  const bathRateHigh = bathRates.high;
  const canCarveBaths =
    bathAreaSqft > 0 && bathAreaSqft < Math.max(sqftLow, 1);

  let billableSqftLow;
  let billableSqftHigh;
  let basePriceLowRaw;
  let basePriceHighRaw;
  let bathPriceLow;
  let bathPriceHigh;
  let livingPriceLow;
  let livingPriceHigh;

  const livingSqftLow = Math.round(
    bathsDominateHome
      ? 0
      : canCarveBaths
        ? Math.max(0, sqftLow - bathAreaSqft)
        : sqftLow
  );
  const livingSqftHigh = Math.round(
    bathsDominateHome
      ? 0
      : canCarveBaths
        ? Math.max(0, sqftHigh - bathAreaSqft)
        : sqftHigh
  );

  if (bathsDominateHome) {
    billableSqftLow = bathAreaSqft;
    billableSqftHigh = bathAreaSqft;
    bathPriceLow = clampCurrency(bathAreaSqft * bathRateLow);
    bathPriceHigh = clampCurrency(bathAreaSqft * bathRateHigh);
    livingPriceLow = 0;
    livingPriceHigh = 0;
    basePriceLowRaw = bathPriceLow;
    basePriceHighRaw = bathPriceHigh;
  } else if (cleanType === "standard") {
    billableSqftLow = Math.round(sqftLow + bathAreaSqft);
    billableSqftHigh = Math.round(sqftHigh + bathAreaSqft);
    livingPriceLow = clampCurrency(livingSqftLow * ratePerSqftLow);
    livingPriceHigh = clampCurrency(livingSqftHigh * ratePerSqftHigh);
    bathPriceLow = clampCurrency(bathAreaSqft * bathRateLow);
    bathPriceHigh = clampCurrency(bathAreaSqft * bathRateHigh);
    basePriceLowRaw = livingPriceLow + bathPriceLow;
    basePriceHighRaw = livingPriceHigh + bathPriceHigh;
  } else {
    billableSqftLow = Math.round(sqftLow + bathAreaSqft);
    billableSqftHigh = Math.round(sqftHigh + bathAreaSqft);
    basePriceLowRaw = billableSqftLow * ratePerSqftLow;
    basePriceHighRaw = billableSqftHigh * ratePerSqftHigh;
    bathPriceLow = canCarveBaths
      ? clampCurrency(bathAreaSqft * bathRateLow)
      : clampCurrency(bathAreaSqft * ratePerSqftLow);
    bathPriceHigh = canCarveBaths
      ? clampCurrency(bathAreaSqft * bathRateHigh)
      : clampCurrency(bathAreaSqft * ratePerSqftHigh);
    livingPriceLow = canCarveBaths
      ? Math.max(0, clampCurrency(basePriceLowRaw) - bathPriceLow)
      : clampCurrency(Math.round(sqftLow) * ratePerSqftLow);
    livingPriceHigh = canCarveBaths
      ? Math.max(0, clampCurrency(basePriceHighRaw) - bathPriceHigh)
      : clampCurrency(Math.round(sqftHigh) * ratePerSqftHigh);
  }

  const minCharge = MIN_CHARGE_BY_TYPE[cleanType] ?? 0;
  const lowBelowMin = basePriceLowRaw < minCharge;
  const highBelowMin = basePriceHighRaw < minCharge;

  let baseLaborCoreLow;
  let baseLaborCoreHigh;
  let usesMinCharge = false;
  let fullyAtMinimum = false;
  let minOnLowOnly = false;

  if (lowBelowMin || highBelowMin) {
    baseLaborCoreLow = clampCurrency(Math.max(basePriceLowRaw, minCharge));
    baseLaborCoreHigh = clampCurrency(Math.max(basePriceHighRaw, minCharge));
    usesMinCharge = true;
    fullyAtMinimum =
      baseLaborCoreLow === minCharge && baseLaborCoreHigh === minCharge;
    minOnLowOnly =
      baseLaborCoreLow === minCharge && baseLaborCoreHigh > minCharge;
  } else {
    baseLaborCoreLow = clampCurrency(basePriceLowRaw);
    baseLaborCoreHigh = clampCurrency(basePriceHighRaw);
  }

  const totalBeforePromoLowRaw =
    baseLaborCoreLow + addonFlat + secondKitchenFeeLow;
  const totalBeforePromoHighRaw =
    baseLaborCoreHigh + addonFlat + secondKitchenFeeHigh;

  const promoDiscountLow = promoValid ? 50 : 0;
  const promoDiscountHigh = promoValid ? 50 : 0;

  const totalAfterPromoLow = clampCurrency(
    totalBeforePromoLowRaw - promoDiscountLow
  );
  const totalAfterPromoHigh = clampCurrency(
    totalBeforePromoHighRaw - promoDiscountHigh
  );

  return {
    bedrooms,
    bathrooms: bathroomUnits,
    sqftInput: Math.round(safeSqftInput),
    estSqft: Math.round(estSqft),
    sqftLow: Math.round(sqftLow),
    sqftHigh: Math.round(sqftHigh),
    billableSqftLow: Math.round(billableSqftLow),
    billableSqftHigh: Math.round(billableSqftHigh),
    bathSqftSurcharge: bathAreaSqft,
    bathsDominateHome,
    canCarveBaths,
    livingSqftLow,
    livingSqftHigh,
    livingPriceLow,
    livingPriceHigh,
    bathAreaSqft,
    bathRateLow:
      bathsDominateHome || canCarveBaths || cleanType === "standard"
        ? bathRateLow
        : ratePerSqftLow,
    bathRateHigh:
      bathsDominateHome || canCarveBaths || cleanType === "standard"
        ? bathRateHigh
        : ratePerSqftHigh,
    bathPriceLow,
    bathPriceHigh,
    displayBathPriceLow: bathPriceLow,
    displayBathPriceHigh: bathPriceHigh,
    usedSqft: Math.round(sqftHigh),
    ratePerSqftLow,
    ratePerSqftHigh,
    ratePerSqft: ratePerSqftHigh,
    billableHoursLow,
    billableHours: billableHoursHigh,
    billableHoursHigh,
    totalPersonHoursHigh,
    minCharge,
    usesMinCharge,
    fullyAtMinimum,
    minOnLowOnly,
    baseLabor: clampCurrency(baseLaborCoreHigh + addonFlat),
    baseLaborCore: baseLaborCoreHigh,
    baseLaborCoreLow,
    baseLaborCoreHigh,
    addonFlatTotal: clampCurrency(addonFlat),
    total: clampCurrency(totalBeforePromoHighRaw),
    promoDiscount: clampCurrency(promoDiscountHigh),
    totalAfterPromoLow,
    totalAfterPromoHigh,
    totalAfterPromo: totalAfterPromoHigh,
    walkthroughArrivalHours: WALKTHROUGH_ARRIVAL_HOURS,
    time: {
      cleaners,
      onSiteRangeLow,
      onSiteRangeHigh,
      displayText: timeDisplayText,
    },
    cleanType,
    ecoProducts: true,
    addonFridge: moveOutIncludesFridgeOven || includeFridge,
    addonOven: moveOutIncludesFridgeOven || includeOven,
    addonSecondKitchen: includeSecondKitchen,
    secondKitchenFeeLow: clampCurrency(secondKitchenFeeLow),
    secondKitchenFeeHigh: clampCurrency(secondKitchenFeeHigh),
    addonHoursLow,
    addonHoursHigh,
    addonFlat: clampCurrency(addonFlat),
    isLargeJob,
  };
}
