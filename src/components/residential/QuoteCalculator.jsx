"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency } from "../../helpers/contactHelpers.js";
import ContactSheet from "./ContactSheet";
import SelectField from "../Fields/SelectField.jsx";
import NumberField from "../Fields/NumberField.jsx";
import { CFG, CONTACT, WALKTHROUGH_ARRIVAL_HOURS } from "../../constants.js";
import { buildCalendlyUrlWithUtm } from "../../helpers/calendlyHelpers.js";
import { useRouter } from "next/navigation";
import { BTN_UPPER, HEADING_UPPER, QUOTE_FIELD_LABEL, QUOTE_SECTION_LABEL } from "../../helpers/typography.js";
import { quoteFieldId } from "../../helpers/fieldIds.js";

/**
 * Golden Hour Cleaning Co. — Quote Calculator (Square Footage Pricing)
 *
 * Pricing model:
 * - Prefer the entered square footage as the floor
 * - Bedroom heuristic (base + beds × per bedroom) only when bedrooms > 0 and
 *   higher than the entry (guards understated size; does not pull large homes down)
 * - Standard home size uses $0.14–$0.20/sq ft; bathrooms use $0.22–$0.40/sq ft.
 *   Deep / move-out bathrooms use 2× the living $/sq ft when carved or when
 *   baths dominate home size
 * - Price (deep / move-out, typical): (home sq ft + baths × 150) × $/sq ft
 * - Breakdown: when baths fit in home size, show home remainder @ 1× and
 *   bathrooms @ denser rate (same dollars as the additive math for deep / move-out)
 * - When baths × 150 ≥ home size: price = (baths × 150) × bathroom $/sq ft;
 *   breakdown/subtitle emphasize bathroom care only
 * - Deep cleans use a condition-based rate range ($0.26–$0.40/sq ft)
 * - Minimum base visit charge: standard $150, deep $250, move-out $350
 *   • Whenever the low-end sq-ft price is under the minimum: floor low only;
 *     high end stays $/sq ft (at least the minimum)
 * - Flat add-ons (fridge, oven, second kitchen) are added after
 *
 * Hours model (approximate, for scheduling only — does not set price):
 * - Convert size + bathrooms + add-ons + second kitchen into person-hours
 * - Bathrooms use a 1.5× time multiplier only when baths × 150 ≥ home size
 * - Deep cleans span productivity from ~346 sq ft/hr (straightforward) to ~225 (moderate)
 * - Scale cleaners so on-site duration stays at most ~4 hours
 *
 * Promo:
 * - GOLDENWELCOME = $50 off Deep Clean only; applied to estimated total
 *
 */

/**
 * Deep-clean condition bands (at ~$90/labor hr).
 * Rate range for quotes: relatively straightforward → moderately labor-intensive
 * (heavier bands confirmed at walkthrough when needed).
 */
const DEEP_RATE_PER_SQFT_LOW = 0.26; // ~346 sq ft/hr at $90/labor hr
const DEEP_RATE_PER_SQFT_HIGH = 0.40; // 225 sq ft/hr
const DEEP_SQFT_PER_HOUR_FAST = 90 / DEEP_RATE_PER_SQFT_LOW;
const DEEP_SQFT_PER_HOUR_SLOW = 225;

/** Public square-footage rates by clean type (low–high; same when fixed). */
const RATE_PER_SQFT = {
  standard: { low: 0.14, high: 0.2 },
  deep: { low: DEEP_RATE_PER_SQFT_LOW, high: DEEP_RATE_PER_SQFT_HIGH },
  move_out: { low: 0.4, high: 0.5 },
};

/** Bathroom care $/sq ft by clean type (denser than living areas). */
const BATH_RATE_PER_SQFT = {
  standard: { low: 0.22, high: 0.4 },
  deep: { low: DEEP_RATE_PER_SQFT_LOW * 2, high: DEEP_RATE_PER_SQFT_HIGH * 2 },
  move_out: { low: 0.8, high: 1.0 },
};

/**
 * Approximate crew productivity (sq ft/hr) for time estimates only.
 * Standard keeps a single mid-band; deep / move-out span condition bands.
 * (~$90/labor hr → rate ≈ 90 / productivity)
 */
const SQFT_PER_HOUR = {
  standard: { fast: 290 / 0.8, slow: 290 / 0.8 },
  deep: { fast: DEEP_SQFT_PER_HOUR_FAST, slow: DEEP_SQFT_PER_HOUR_SLOW },
  move_out: { fast: 225, slow: 180 }, // $0.40 → $0.50
};

const MIN_VISIT_HOURS_ONE_CLEANER = 2;
/** Keep on-site duration at or under this by adding cleaners as needed. */
const MAX_ON_SITE_HOURS = 4;

/** Minimum base cleaning charge by clean type (before flat add-ons / promo). */
const MIN_CHARGE_BY_TYPE = {
  standard: 150,
  deep: 250,
  move_out: 350,
};

// We treat anything over 16 total person-hours as a "large job"
const MAX_TOTAL_PERSON_HOURS = 16;

/**
 * Add-on configuration — flat price for quote; hours only affect time estimate
 */
const ADDON_FRIDGE_PRICE = 60;
const ADDON_FRIDGE_HOURS_LOW = 0.5;   // 30 min
const ADDON_FRIDGE_HOURS_HIGH = 1.25; // 75 min

const ADDON_OVEN_PRICE = 60;
const ADDON_OVEN_HOURS_LOW = 0.5;   // 30 min
const ADDON_OVEN_HOURS_HIGH = 1.25; // 75 min

/** Second kitchen: flat fee range for price; hours for time estimate only. */
const ADDON_SECOND_KITCHEN_FEE_LOW = 75;
const ADDON_SECOND_KITCHEN_FEE_HIGH = 200;
const ADDON_SECOND_KITCHEN_HOURS_LOW = 1;    // 60 min
const ADDON_SECOND_KITCHEN_HOURS_HIGH = 1.5; // 90 min

const FULL_BATH_SQFT = CFG.roomsToSqft.perBathroom;

/** Snap to 0.5 increments (e.g. 2.5 = two full + one half). */
function snapBathroomUnits(bathrooms) {
  const n = Number.isFinite(Number(bathrooms)) ? Number(bathrooms) : 0;
  return Math.max(0, Math.round(n * 2) / 2);
}

/** Bathrooms take denser care — time only when baths dominate home size. */
const BATH_TIME_MULTIPLIER = 1.5;

/** Approximate person-hours one full bath adds at the given productivity (half = 50%). */
function fullBathPersonHours(sqftPerHour, timeMultiplier = 1) {
  return (FULL_BATH_SQFT / sqftPerHour) * timeMultiplier;
}

function formatRatePerSqft(low, high) {
  const lo = Number(low).toFixed(2);
  const hi = Number(high).toFixed(2);
  return lo === hi ? `$${lo}/sq ft` : `$${lo}–$${hi}/sq ft`;
}

function formatMoneyRange(low, high) {
  if (low === high) return `$${low.toLocaleString()}`;
  return `$${low.toLocaleString()}–$${high.toLocaleString()}`;
}

function formatSqftRange(low, high) {
  if (low === high) return `${low.toLocaleString()} sq ft`;
  return `${low.toLocaleString()}–${high.toLocaleString()} sq ft`;
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

export default function QuoteCalculator({
  title,
  subtitle = '',
  initialLevel = "deep",
}) {
  const router = useRouter();
  const quoteContactBtnRef = useRef(null);
  const quoteScheduleBtnRef = useRef(null);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(1500);

  const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);

  const [cleanType, setCleanType] = useState(() =>
    VALID_LEVELS.has(initialLevel) ? initialLevel : "deep"
  );

  // Add-ons
  const [includeFridge, setIncludeFridge] = useState(false);
  const [includeOven, setIncludeOven] = useState(false);
  const [includeSecondKitchen, setIncludeSecondKitchen] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [promoError, setPromoError] = useState(null);

  useEffect(() => {
    if (VALID_LEVELS.has(initialLevel) && initialLevel !== cleanType) {
      setCleanType(initialLevel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevel]);

  // Promo validation (client-side UX)
  useEffect(() => {
    if (!promoCode) {
      setPromoValid(false);
      setPromoError(null);
      return;
    }

    const code = promoCode.trim().toUpperCase();
    if (!(code in CFG.promos)) {
      setPromoValid(false);
      setPromoError("Invalid promo code.");
      return;
    }

    const rule = CFG.promos[code];
    if (rule.level && rule.level !== cleanType) {
      setPromoValid(false);
      setPromoError("This code only applies to a Deep Clean.");
      return;
    }

    setPromoValid(true);
    setPromoError(null);
  }, [promoCode, cleanType]);

  // -----------------------------
  // Calculation
  // -----------------------------
  const result = useMemo(() => {
    const safeSqftInput = Math.max(
      0,
      Number.isFinite(Number(sqft)) ? Number(sqft) : 0
    );

    const bathroomUnits = snapBathroomUnits(bathrooms);

    // Heuristic sqft from beds only. No bedrooms entered → no size heuristic.
    // Bathrooms add denser care as +150 sq ft each at the base $/sq ft rate.
    const hasBedroomHeuristic = bedrooms > 0;
    const estSqft = hasBedroomHeuristic
      ? CFG.roomsToSqft.base + bedrooms * CFG.roomsToSqft.perBedroom
      : 0;

    const rates = RATE_PER_SQFT[cleanType] ?? RATE_PER_SQFT.deep;
    const productivity = SQFT_PER_HOUR[cleanType] ?? SQFT_PER_HOUR.deep;
    const ratePerSqftLow = rates.low;
    const ratePerSqftHigh = rates.high;

    // Entered sq ft is the floor. Heuristic only raises the high end when larger.
    let sqftLow;
    let sqftHigh;

    if (safeSqftInput <= 0) {
      sqftLow = hasBedroomHeuristic ? estSqft : 0;
      sqftHigh = hasBedroomHeuristic ? estSqft : 0;
    } else {
      sqftLow = safeSqftInput;
      sqftHigh = hasBedroomHeuristic
        ? Math.max(estSqft, safeSqftInput)
        : safeSqftInput;
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

    // Hours: approximate only (scheduling).
    let addonHoursLow = bathPersonHoursLow;
    let addonHoursHigh = bathPersonHoursHigh;
    let addonFlat = 0;
    let secondKitchenFeeLow = 0;
    let secondKitchenFeeHigh = 0;

    if (includeFridge) {
      addonHoursLow += ADDON_FRIDGE_HOURS_LOW;
      addonHoursHigh += ADDON_FRIDGE_HOURS_HIGH;
      addonFlat += ADDON_FRIDGE_PRICE;
    }

    if (includeOven) {
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

    // Person-hours for ONE cleaner from sq ft + time add-ons
    const billableHoursLowRaw = Math.max(
      MIN_VISIT_HOURS_ONE_CLEANER,
      sqftLow / productivity.fast + addonHoursLow
    );
    const billableHoursHighRaw = Math.max(
      MIN_VISIT_HOURS_ONE_CLEANER,
      sqftHigh / productivity.slow + addonHoursHigh
    );

    // Add cleaners so on-site time stays at most MAX_ON_SITE_HOURS (based on high estimate)
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

    // Price: normally (home + baths×150) × rate (deep / move-out).
    // Standard bathrooms use $0.22–$0.40/sq ft. When baths dominate home size:
    // (baths×150) × bathroom rate only.
    const bathRates = BATH_RATE_PER_SQFT[cleanType] ?? BATH_RATE_PER_SQFT.deep;
    const bathRateLow = bathRates.low;
    const bathRateHigh = bathRates.high;
    const canCarveBaths =
      bathAreaSqft > 0 && bathAreaSqft < Math.max(sqftLow, 1);

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

    let billableSqftLow;
    let billableSqftHigh;
    let basePriceLowRaw;
    let basePriceHighRaw;
    let bathPriceLow;
    let bathPriceHigh;
    let livingPriceLow;
    let livingPriceHigh;

    if (bathsDominateHome) {
      // Bathroom-only quote at denser bathroom rate
      billableSqftLow = bathAreaSqft;
      billableSqftHigh = bathAreaSqft;
      bathPriceLow = clampCurrency(bathAreaSqft * bathRateLow);
      bathPriceHigh = clampCurrency(bathAreaSqft * bathRateHigh);
      livingPriceLow = 0;
      livingPriceHigh = 0;
      basePriceLowRaw = bathPriceLow;
      basePriceHighRaw = bathPriceHigh;
    } else if (cleanType === "standard") {
      // Home @ $0.14–$0.20 + bathrooms @ $0.22–$0.40
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

    const displayBathPriceLow = bathPriceLow;
    const displayBathPriceHigh = bathPriceHigh;

    const minCharge = MIN_CHARGE_BY_TYPE[cleanType] ?? 0;
    const lowBelowMin = basePriceLowRaw < minCharge;
    const highBelowMin = basePriceHighRaw < minCharge;

    let baseLaborCoreLow;
    let baseLaborCoreHigh;
    let usesMinCharge = false;
    let fullyAtMinimum = false;
    let minOnLowOnly = false;

    if (lowBelowMin || highBelowMin) {
      // Floor low end to minimum when under; high end stays $/sq ft (never below min)
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

    // Promo (client-side): $50 off Deep Clean only
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
      displayBathPriceLow,
      displayBathPriceHigh,
      // For backwards compatibility: "sq ft used for quote" = high end
      usedSqft: Math.round(sqftHigh),

      ratePerSqftLow,
      ratePerSqftHigh,
      // Compatibility: single-rate callers use the midpoint/high band high
      ratePerSqft: ratePerSqftHigh,
      billableHoursLow,
      billableHours: billableHoursHigh, // high end
      billableHoursHigh,
      totalPersonHoursHigh,

      minCharge,
      usesMinCharge,
      fullyAtMinimum,
      minOnLowOnly,

      // High-end values in the detailed breakdown (most conservative)
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

      addonFridge: includeFridge,
      addonOven: includeOven,
      addonSecondKitchen: includeSecondKitchen,
      secondKitchenFeeLow: clampCurrency(secondKitchenFeeLow),
      secondKitchenFeeHigh: clampCurrency(secondKitchenFeeHigh),
      addonHoursLow,
      addonHoursHigh,
      addonFlat: clampCurrency(addonFlat),

      isLargeJob,
    };
  }, [
    bedrooms,
    bathrooms,
    sqft,
    cleanType,
    promoValid,
    includeFridge,
    includeOven,
    includeSecondKitchen,
  ]);

  const hasSqftRange = result.sqftLow !== result.sqftHigh;
  const hasBathCare = result.bathAreaSqft > 0;
  const bathsDominate = result.bathsDominateHome;

  const bathEstimateLabel =
    result.bathrooms === 1
      ? `1 bath × ~${FULL_BATH_SQFT} = ~${result.bathAreaSqft.toLocaleString()} sq ft`
      : `${result.bathrooms} baths × ~${FULL_BATH_SQFT} = ~${result.bathAreaSqft.toLocaleString()} sq ft`;
  const bathCountLabel =
    result.bathrooms === 1 ? "1 bath" : `${result.bathrooms} baths`;

  const breakdownSqftLabel = bathsDominate
    ? bathEstimateLabel
    : hasSqftRange
      ? `${result.sqftLow.toLocaleString()} to ${result.sqftHigh.toLocaleString()} square feet`
      : `${result.sqftHigh.toLocaleString()} square feet`;

  const quoteTotalLabel =
    result.totalAfterPromoLow === result.totalAfterPromoHigh
      ? formatCurrency(result.totalAfterPromoHigh)
      : `${formatCurrency(result.totalAfterPromoLow)} to ${formatCurrency(result.totalAfterPromoHigh)}`;

  const breakdownA11yText = useMemo(() => {
    const parts = [];

    parts.push(
      bathsDominate
        ? `Bathroom square feet used for estimate, ${bathEstimateLabel}.`
        : `Home size used for estimate, ${breakdownSqftLabel}.`
    );
    if (result.minOnLowOnly) {
      parts.push(
        `Minimum visit charge on the low end, ${formatCurrency(result.minCharge)}.`
      );
      if (hasBathCare) {
        if (bathsDominate) {
          parts.push(
            `High-end bathroom care, ${bathEstimateLabel} at ${formatRatePerSqft(result.bathRateLow, result.bathRateHigh).replace("/", " per ")}, ${formatCurrency(result.displayBathPriceHigh)}.`
          );
        } else {
          parts.push(
            `High-end living space, ${result.livingSqftHigh.toLocaleString()} square feet at ${formatRatePerSqft(result.ratePerSqftLow, result.ratePerSqftHigh).replace("/", " per ")}, ${formatCurrency(result.livingPriceHigh)}.`
          );
          parts.push(
            `High-end bathroom care at ${formatRatePerSqft(result.bathRateLow, result.bathRateHigh).replace("/", " per ")}, ${formatCurrency(result.bathPriceHigh)}.`
          );
        }
      } else {
        parts.push(
          `High-end base cleaning at ${formatRatePerSqft(result.ratePerSqftLow, result.ratePerSqftHigh).replace("/", " per ")}, ${formatCurrency(result.baseLaborCoreHigh)}.`
        );
      }
    } else if (result.usesMinCharge) {
      parts.push(
        `Minimum visit charge, ${formatCurrency(result.minCharge)}.`
      );
    } else if (hasBathCare) {
      if (bathsDominate) {
        parts.push(
          `Bathroom care, ${bathEstimateLabel} at ${formatRatePerSqft(result.bathRateLow, result.bathRateHigh).replace("/", " per ")}, ${result.displayBathPriceLow === result.displayBathPriceHigh
            ? formatCurrency(result.displayBathPriceHigh)
            : `${formatCurrency(result.displayBathPriceLow)} to ${formatCurrency(result.displayBathPriceHigh)}`
          }.`
        );
      } else {
        parts.push(
          `Living space, ${formatSqftRange(result.livingSqftLow, result.livingSqftHigh).replace(" sq ft", " square feet")} at ${formatRatePerSqft(result.ratePerSqftLow, result.ratePerSqftHigh).replace("/", " per ")}, ${result.livingPriceLow === result.livingPriceHigh
            ? formatCurrency(result.livingPriceHigh)
            : `${formatCurrency(result.livingPriceLow)} to ${formatCurrency(result.livingPriceHigh)}`
          }.`
        );
        parts.push(
          `Bathroom care, ${result.bathAreaSqft.toLocaleString()} square feet (${result.bathrooms} ${result.bathrooms === 1 ? "bath" : "baths"} at approximately ${FULL_BATH_SQFT} square feet each) at ${formatRatePerSqft(result.bathRateLow, result.bathRateHigh).replace("/", " per ")}${result.canCarveBaths ? " — denser care" : ""}, ${result.bathPriceLow === result.bathPriceHigh
            ? formatCurrency(result.bathPriceHigh)
            : `${formatCurrency(result.bathPriceLow)} to ${formatCurrency(result.bathPriceHigh)}`
          }.`
        );
      }
    } else {
      const basePriceLabel =
        result.baseLaborCoreLow === result.baseLaborCoreHigh
          ? formatCurrency(result.baseLaborCoreHigh)
          : `${formatCurrency(result.baseLaborCoreLow)} to ${formatCurrency(result.baseLaborCoreHigh)}`;
      parts.push(
        `Base cleaning at ${formatRatePerSqft(result.ratePerSqftLow, result.ratePerSqftHigh).replace("/", " per ")}, ${basePriceLabel}.`
      );
    }

    if (result.addonFridge) {
      parts.push(
        `Inside fridge add-on, plus ${formatCurrency(ADDON_FRIDGE_PRICE)}.`
      );
    }
    if (result.addonOven) {
      parts.push(
        `Inside oven add-on, plus ${formatCurrency(ADDON_OVEN_PRICE)}.`
      );
    }
    if (result.addonSecondKitchen) {
      parts.push(
        `Second full kitchen, plus ${formatCurrency(result.secondKitchenFeeLow)} to ${formatCurrency(result.secondKitchenFeeHigh)} or more, adds approximately 60 to 90 minutes.`
      );
    }
    if (promoValid) {
      parts.push(
        `Promo golden welcome, minus ${formatCurrency(result.promoDiscount)}.`
      );
    }

    parts.push(
      "Why is pricing shown as a range? The price per square foot varies based on your home's condition. Buildup, dust, grease, pet hair, and other factors can affect the overall size and scope of the cleaning. Bathrooms also need denser care, so they're priced at a higher rate than living areas."
    );

    return parts.join(" ");
  }, [
    result,
    breakdownSqftLabel,
    promoValid,
    hasBathCare,
    bathsDominate,
    bathEstimateLabel,
  ]);

  const summaryA11yText = useMemo(() => {
    const parts = [];

    parts.push(
      result.fullyAtMinimum
        ? `Estimated total ${quoteTotalLabel}, minimum visit charge.`
        : result.minOnLowOnly
          ? `Estimated total ${quoteTotalLabel}, low end is our minimum visit charge; high end based on ${bathsDominate ? bathCountLabel : `${result.sqftHigh.toLocaleString()} square feet`}.`
          : `Estimated total ${quoteTotalLabel}, based on ${bathsDominate ? bathCountLabel : breakdownSqftLabel}.`
    );

    if (!result.isLargeJob) {
      parts.push(
        `Estimated cleaning time on site ${result.time.displayText} with ${result.time.cleaners} ${result.time.cleaners === 1 ? "cleaner" : "cleaners"}.`
      );
      parts.push(
        `When you schedule, you'll choose a ${WALKTHROUGH_ARRIVAL_HOURS}-hour arrival window. Once we arrive, we'll do a quick walkthrough, confirm your final price, and begin cleaning right away.`
      );
    } else {
      parts.push(
        "This is a larger project. For accurate scheduling, please call us to book so we can plan enough time and team support."
      );
    }

    return parts.join(" ");
  }, [
    result,
    breakdownSqftLabel,
    quoteTotalLabel,
    bathsDominate,
    bathCountLabel,
  ]);

  const quoteResultsA11yText = useMemo(
    () =>
      `Breakdown. ${breakdownA11yText} Your quote. ${summaryA11yText}`,
    [breakdownA11yText, summaryA11yText]
  );

  const roomsHintId = "quote-rooms-hint";
  const sqftHintId = "quote-sqft-hint";
  const sqftRangeHintId = "quote-sqft-range-hint";
  const cleanTypeLabelId = "quote-clean-type-label";
  const cleanTypeTipId = "quote-clean-type-tip";
  const cleanTypeNoteId = "quote-clean-type-note";
  const promoHintId = "quote-promo-hint";
  const promoErrorId = "quote-promo-error";
  const promoSuccessId = "quote-promo-success";
  const breakdownHeadingId = "quote-breakdown-heading";
  const quoteHeadingId = "quote-summary-heading";
  const quoteResultsHeadingId = "quote-results-heading";
  const quoteResultsDescId = "quote-results-a11y-desc";
  const quoteBreakdownA11yId = "quote-breakdown-a11y";
  const quoteSummaryA11yId = "quote-summary-a11y";

  function focusQuoteContactButton(e) {
    if (e.key !== "Tab" || e.shiftKey) return;
    const contactBtn = quoteContactBtnRef.current;
    if (!contactBtn) return;
    e.preventDefault();
    contactBtn.focus();
  }

  function focusQuoteScheduleButton(e) {
    if (e.key !== "Tab" || !e.shiftKey) return;
    const scheduleBtn = quoteScheduleBtnRef.current;
    if (!scheduleBtn) return;
    e.preventDefault();
    scheduleBtn.focus();
  }

  function onScheduleClick(e) {
    e.preventDefault();

    const calendlyUrl = buildCalendlyUrlWithUtm(CONTACT.bookingUrl, result, {
      applied: promoValid,
      code: promoCode.trim().toUpperCase(),
      amount: promoValid ? 50 : 0,
    });

    sessionStorage.setItem("calendlyUrl", calendlyUrl);
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    router.push("/book");
  }

  return (
    <section
      id="quote-calculator"
      aria-labelledby="quote-calculator-heading"
      className="mx-auto max-w-4xl rounded-3xl border border-amber-200 bg-white p-6 shadow-sm md:p-8"
    >
      <h2
        id="quote-calculator-heading"
        tabIndex={-1}
        className={`text-2xl md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
      >
        {title}
      </h2>

      <p id="quote-calculator-desc" className="mt-1 text-stone-600">
        {subtitle ||
          "Get an instant estimate based on your home’s size and clean type. Because every home is unique, we’ll confirm your final price after a quick walkthrough based on the condition and level of care needed."}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <fieldset className="rounded-2xl border p-4">
          <legend className={`${QUOTE_SECTION_LABEL} px-1`}>
            Bedrooms &amp; Bathrooms
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <NumberField
              label="Bedrooms"
              value={bedrooms}
              setValue={setBedrooms}
              min={0}
              showStepper
              describedBy={roomsHintId}
            />
            <NumberField
              label="Bathrooms"
              value={bathrooms}
              setValue={setBathrooms}
              min={0}
              step={0.5}
              showStepper
              describedBy={roomsHintId}
            />
          </div>
          <p id={roomsHintId} className="mt-2 text-xs text-stone-500">
            Select how many bedrooms and bathrooms you’d like us to care for.
            We’ll estimate your home’s size from this so your quote reflects the
            right amount of time and attention.
          </p>
        </fieldset>

        <fieldset className="rounded-2xl border p-4">
          <legend className={`${QUOTE_SECTION_LABEL} px-1`}>Square Feet</legend>
          <div className="mt-4">
            <NumberField
              label="Total Sq Ft"
              value={sqft}
              setValue={setSqft}
              min={0}
              step={50}
              describedBy={
                result.sqftInput > 0 && result.estSqft > result.sqftInput
                  ? `${sqftHintId} ${sqftRangeHintId}`
                  : sqftHintId
              }
            />
            <p id={sqftHintId} className="mt-1 text-xs text-stone-500">
              Enter your best estimate. We’ll use this as your home size. If our
              bedroom-based estimate is larger, we’ll quote a range so you’re
              covered if square footage was understated.
            </p>

            {result.sqftInput > 0 && result.estSqft > result.sqftInput && (
              <p id={sqftRangeHintId} className="mt-1 text-xs text-stone-500">
                Your entry is{" "}
                <span className="font-medium">
                  {result.sqftInput.toLocaleString()} sq ft
                </span>
                . Based on bedrooms, we’d estimate about{" "}
                <span className="font-medium">
                  {result.estSqft.toLocaleString()} sq ft
                </span>
                , so this quote uses that higher end too.
              </p>
            )}
          </div>
        </fieldset>
      </div>

      <fieldset className="mt-6 rounded-2xl border p-4 relative">
        <legend className={`${QUOTE_SECTION_LABEL} px-1`}>Cleaning options</legend>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span id={cleanTypeLabelId} className={`${QUOTE_FIELD_LABEL} block`}>
              Clean Type
            </span>

            <SelectField
              id={quoteFieldId("clean-type")}
              labelledBy={cleanTypeLabelId}
              describedBy={`${cleanTypeTipId} ${cleanTypeNoteId}`}
              value={cleanType}
              setValue={setCleanType}
              options={[
                { value: "deep", label: "Deep Clean" },
                { value: "standard", label: "Standard Clean" },
                { value: "move_out", label: "Move-In / Move-Out" },
              ]}
            />
            <p id={cleanTypeTipId} className="mt-1 text-[11px] text-stone-500">
              View our{" "}
              <a
                href="/residential/services"
                className="font-medium text-stone-700 underline underline-offset-2 hover:text-stone-900"
              >
                Residential Services
              </a>{" "}
              for details on what each clean type includes.
            </p>
            <p id={cleanTypeNoteId} className="mt-1 text-[11px] text-stone-500">
              Note: <em>Standard cleans</em> are reserved for recurring customers
              or homes that have had a professional cleaning within the past 2–4
              weeks.
            </p>
          </div>

          <div>
            <label htmlFor="promo-code" className={`${QUOTE_FIELD_LABEL} block`}>
              Promo code
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="promo-code"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter code"
                className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                inputMode="text"
                autoCapitalize="characters"
                aria-invalid={promoError ? true : undefined}
                aria-describedby={
                  [
                    promoHintId,
                    promoError ? promoErrorId : null,
                    promoValid && !promoError ? promoSuccessId : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
              />
            </div>
            {promoError && (
              <p id={promoErrorId} role="alert" className="mt-1 text-xs text-red-600">
                {promoError}
              </p>
            )}
            {promoValid && !promoError && (
              <p id={promoSuccessId} className="mt-1 text-xs text-green-700">
                Code applied: minus $50
              </p>
            )}
            <p id={promoHintId} className="mt-1 text-[11px] text-stone-500">
              Applies to Deep Clean only. Discount reduces the estimated total.
            </p>
          </div>
        </div>

        <div className="mt-4 border-t pt-3 text-sm">
          <span id="quote-addons-label" className={`${QUOTE_FIELD_LABEL} mb-2 block font-medium`}>
            Optional add-ons
          </span>
          <div
            role="group"
            aria-labelledby="quote-addons-label"
            className="space-y-2 text-xs text-stone-700"
          >
            <div className="flex items-start gap-2">
              <input
                id="addon-fridge"
                type="checkbox"
                checked={includeFridge}
                onChange={(e) => setIncludeFridge(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor="addon-fridge">
                <span className="font-medium">Inside fridge</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_FRIDGE_PRICE}, adds approximately 30 to 75 minutes)
                </span>
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="addon-oven"
                type="checkbox"
                checked={includeOven}
                onChange={(e) => setIncludeOven(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor="addon-oven">
                <span className="font-medium">Inside oven</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_OVEN_PRICE}, adds approximately 30 to 75 minutes)
                </span>
              </label>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="addon-second-kitchen"
                type="checkbox"
                checked={includeSecondKitchen}
                onChange={(e) => setIncludeSecondKitchen(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor="addon-second-kitchen">
                <span className="font-medium">Second full kitchen</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_SECOND_KITCHEN_FEE_LOW}–${ADDON_SECOND_KITCHEN_FEE_HIGH}+, adds
                  approximately 60 to 90 minutes)
                </span>
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <div
        id="quote-results"
        tabIndex={-1}
        aria-labelledby={quoteResultsHeadingId}
        aria-describedby={quoteResultsDescId}
        className="mt-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-2xl"
      >
        <h3 id={quoteResultsHeadingId} className="sr-only">
          Quote results
        </h3>
        <p id={quoteResultsDescId} className="sr-only">
          {quoteResultsA11yText}
        </p>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {quoteResultsA11yText}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <section
            aria-labelledby={breakdownHeadingId}
            aria-describedby={quoteBreakdownA11yId}
            className="rounded-2xl border p-4"
          >
            <h3 id={breakdownHeadingId} className={QUOTE_SECTION_LABEL}>
              Breakdown
            </h3>
            <p id={quoteBreakdownA11yId} className="sr-only">
              {breakdownA11yText}
            </p>
            <ul
              aria-hidden="true"
              className="mt-3 space-y-1 text-sm text-stone-700"
            >
              <li className="flex justify-between gap-3">
                <span>
                  {bathsDominate
                    ? "Bathroom sq ft used for estimate"
                    : "Home size used for estimate"}
                </span>
                <span className="shrink-0 tabular-nums text-right">
                  {bathsDominate
                    ? bathEstimateLabel
                    : hasSqftRange
                      ? `${result.sqftLow.toLocaleString()}–${result.sqftHigh.toLocaleString()} sq ft`
                      : `${result.sqftHigh.toLocaleString()} sq ft`}
                </span>
              </li>

              {result.minOnLowOnly ? (
                <>
                  <li className="flex justify-between gap-3">
                    <span>
                      Minimum visit charge{" "}
                      <span className="text-stone-500">(low end)</span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      ${result.minCharge.toLocaleString()}
                    </span>
                  </li>
                  {hasBathCare ? (
                    bathsDominate ? (
                      <li className="flex justify-between gap-3">
                        <span>
                          Bathroom care{" "}
                          <span className="text-stone-500">
                            (high end · {result.bathrooms}{" "}
                            {result.bathrooms === 1 ? "bath" : "baths"} × ~
                            {FULL_BATH_SQFT} sq ft @{" "}
                            {formatRatePerSqft(
                              result.bathRateLow,
                              result.bathRateHigh
                            )}
                            )
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          ${result.displayBathPriceHigh.toLocaleString()}
                        </span>
                      </li>
                    ) : (
                      <>
                        <li className="flex justify-between gap-3">
                          <span>
                            Living space{" "}
                            <span className="text-stone-500">
                              (high end ·{" "}
                              {formatRatePerSqft(
                                result.ratePerSqftLow,
                                result.ratePerSqftHigh
                              )}{" "}
                              × {result.livingSqftHigh.toLocaleString()} sq ft)
                            </span>
                          </span>
                          <span className="shrink-0 tabular-nums">
                            ${result.livingPriceHigh.toLocaleString()}
                          </span>
                        </li>
                        <li className="flex justify-between gap-3">
                          <span>
                            Bathroom care{" "}
                            <span className="text-stone-500">
                              (high end · {result.bathrooms}{" "}
                              {result.bathrooms === 1 ? "bath" : "baths"} × ~
                              {FULL_BATH_SQFT} sq ft @{" "}
                              {formatRatePerSqft(
                                result.bathRateLow,
                                result.bathRateHigh
                              )}
                              )
                            </span>
                          </span>
                          <span className="shrink-0 tabular-nums">
                            ${result.bathPriceHigh.toLocaleString()}
                          </span>
                        </li>
                      </>
                    )
                  ) : (
                    <li className="flex justify-between gap-3">
                      <span>
                        Base cleaning{" "}
                        <span className="text-stone-500">
                          (high end ·{" "}
                          {formatRatePerSqft(
                            result.ratePerSqftLow,
                            result.ratePerSqftHigh
                          )}{" "}
                          × {result.sqftHigh.toLocaleString()} sq ft)
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        ${result.baseLaborCoreHigh.toLocaleString()}
                      </span>
                    </li>
                  )}
                </>
              ) : result.usesMinCharge ? (
                <li className="flex justify-between gap-3">
                  <span>Minimum visit charge</span>
                  <span className="shrink-0 tabular-nums">
                    {formatMoneyRange(
                      result.baseLaborCoreLow,
                      result.baseLaborCoreHigh
                    )}
                  </span>
                </li>
              ) : hasBathCare ? (
                bathsDominate ? (
                  <li className="flex justify-between gap-3">
                    <span>
                      Bathroom care{" "}
                      <span className="text-stone-500">
                        ({result.bathrooms}{" "}
                        {result.bathrooms === 1 ? "bath" : "baths"} × ~
                        {FULL_BATH_SQFT} sq ft @{" "}
                        {formatRatePerSqft(
                          result.bathRateLow,
                          result.bathRateHigh
                        )}
                        )
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {formatMoneyRange(
                        result.displayBathPriceLow,
                        result.displayBathPriceHigh
                      )}
                    </span>
                  </li>
                ) : (
                  <>
                    <li className="flex justify-between gap-3">
                      <span>
                        Living space{" "}
                        <span className="text-stone-500">
                          ({formatRatePerSqft(
                            result.ratePerSqftLow,
                            result.ratePerSqftHigh
                          )}{" "}
                          × {formatSqftRange(result.livingSqftLow, result.livingSqftHigh)})
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {formatMoneyRange(
                          result.livingPriceLow,
                          result.livingPriceHigh
                        )}
                      </span>
                    </li>
                    <li className="flex justify-between gap-3">
                      <span>
                        Bathroom care{" "}
                        <span className="text-stone-500">
                          ({result.bathrooms}{" "}
                          {result.bathrooms === 1 ? "bath" : "baths"} × ~
                          {FULL_BATH_SQFT} sq ft @{" "}
                          {formatRatePerSqft(
                            result.bathRateLow,
                            result.bathRateHigh
                          )}
                          )
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {formatMoneyRange(
                          result.bathPriceLow,
                          result.bathPriceHigh
                        )}
                      </span>
                    </li>
                  </>
                )
              ) : (
                <li className="flex justify-between gap-3">
                  <span>
                    Base cleaning{" "}
                    <span className="text-stone-500">
                      ({formatRatePerSqft(
                        result.ratePerSqftLow,
                        result.ratePerSqftHigh
                      )}
                      {result.sqftLow === result.sqftHigh
                        ? ` × ${result.sqftHigh.toLocaleString()}`
                        : ` × ${result.sqftLow.toLocaleString()}–${result.sqftHigh.toLocaleString()}`}
                      {" "}sq ft)
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatMoneyRange(
                      result.baseLaborCoreLow,
                      result.baseLaborCoreHigh
                    )}
                  </span>
                </li>
              )}

              {result.addonFridge && (
                <li className="flex justify-between">
                  <span>Inside fridge add-on</span>
                  <span className="tabular-nums">+${ADDON_FRIDGE_PRICE}</span>
                </li>
              )}
              {result.addonOven && (
                <li className="flex justify-between">
                  <span>Inside oven add-on</span>
                  <span className="tabular-nums">+${ADDON_OVEN_PRICE}</span>
                </li>
              )}
              {result.addonSecondKitchen && (
                <li className="flex justify-between gap-3">
                  <span>
                    Second full kitchen{" "}
                    <span className="text-stone-500">(~60–90 min)</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    +${result.secondKitchenFeeLow}–${result.secondKitchenFeeHigh}+
                  </span>
                </li>
              )}

              {promoValid && (
                <li className="flex justify-between text-emerald-800">
                  <span>Promo (GOLDENWELCOME)</span>
                  <span className="tabular-nums">
                    −${result.promoDiscount.toLocaleString()}
                  </span>
                </li>
              )}
            </ul>

            <div className="mt-4 border-t border-stone-200 pt-3">
              <p className="text-sm font-medium text-stone-800">
                Why is pricing shown as a range?
              </p>
              <p className="mt-1 text-xs text-stone-600">
                The price per square foot varies based on your home&apos;s
                condition. Buildup, dust, grease, pet hair, and other factors can
                affect the overall size and scope of the cleaning. Bathrooms also
                need denser care, so they&apos;re priced at a higher rate than
                living areas.
              </p>
            </div>
          </section>

          <section
            aria-labelledby={quoteHeadingId}
            aria-describedby={quoteSummaryA11yId}
            className="rounded-2xl border p-4 bg-amber-50/60"
          >
            <h3 id={quoteHeadingId} className={QUOTE_SECTION_LABEL}>
              Your quote
            </h3>
            <p id={quoteSummaryA11yId} className="sr-only">
              {summaryA11yText}
            </p>

            <div aria-hidden="true">
              <div className="mt-3">
                <div>
                  <p className="text-3xl md:text-4xl font-semibold tabular-nums">
                    {result.totalAfterPromoLow === result.totalAfterPromoHigh
                      ? formatCurrency(result.totalAfterPromoHigh)
                      : `${formatCurrency(
                        result.totalAfterPromoLow
                      )} – ${formatCurrency(result.totalAfterPromoHigh)}`}
                  </p>

                  <p className="mt-1 text-xs text-stone-600">
                    {result.fullyAtMinimum ? (
                      <>Minimum visit charge.</>
                    ) : result.minOnLowOnly ? (
                      <>
                        Low end is our minimum visit charge; high end based on{" "}
                        {bathsDominate
                          ? bathCountLabel
                          : `${result.sqftHigh.toLocaleString()} sq ft`}
                        .
                      </>
                    ) : bathsDominate ? (
                      <>Estimated based on {bathCountLabel}.</>
                    ) : hasSqftRange ? (
                      <>
                        Estimated range based on{" "}
                        {result.sqftLow.toLocaleString()}–
                        {result.sqftHigh.toLocaleString()} sq ft.
                      </>
                    ) : (
                      <>
                        Estimated based on{" "}
                        {result.sqftHigh.toLocaleString()} sq ft.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {!result.isLargeJob && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/40 p-3">
                  <div className="text-sm text-stone-800">
                    Estimated cleaning time on site:{" "}
                    <span className="font-medium tabular-nums">
                      {result.time.displayText}
                    </span>{" "}
                    with{" "}
                    <span className="font-medium">
                      {result.time.cleaners}{" "}
                      {result.time.cleaners === 1 ? "cleaner" : "cleaners"}
                    </span>
                    .
                  </div>
                  <div className="mt-1 text-xs text-stone-600">
                    When you schedule, you&apos;ll choose a{" "}
                    <span className="font-medium">
                      {WALKTHROUGH_ARRIVAL_HOURS}-hour arrival window.
                    </span>{" "}
                    Once we
                    arrive, we&apos;ll do a quick walkthrough, confirm your final
                    price, and begin cleaning right away.
                  </div>
                </div>
              )}

              {result.isLargeJob && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-xs text-stone-700">
                  This is a larger project. For accurate scheduling, please call us
                  to book so we can plan enough time and team support.
                </div>
              )}
            </div>

            {/* Dual CTA: Calendly for normal jobs, Call-to-book for large jobs */}
            <div
              role="group"
              aria-label="Book or ask questions about your quote"
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              {!result.isLargeJob ? (
                <>
                  <button
                    ref={quoteScheduleBtnRef}
                    type="button"
                    onClick={onScheduleClick}
                    onKeyDown={focusQuoteContactButton}
                    className={`${BTN_UPPER} inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl bg-[#333333] px-4 py-3 text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300`}
                    aria-label="Schedule this cleaning"
                  >
                    Schedule This Cleaning
                  </button>

                  <ContactSheet
                    ref={quoteContactBtnRef}
                    className="min-w-0 flex-1"
                    phone={CONTACT.phone}
                    sms={CONTACT.sms}
                    email={CONTACT.email}
                    onKeyDown={focusQuoteScheduleButton}
                    context={{
                      level: cleanType,
                      sqftLow: result.sqftLow,
                      sqftHigh: result.sqftHigh,
                      sqftInput: result.sqftInput,
                      bedrooms,
                      bathrooms,
                      total: result.totalAfterPromo, // upper end
                      totalLow: result.totalAfterPromoLow,
                      ecoProducts: true,
                      cleaners: result.time.cleaners,
                      billableHoursLow: result.billableHoursLow,
                      billableHours: result.billableHours,
                      ratePerSqftLow: result.ratePerSqftLow,
                      ratePerSqftHigh: result.ratePerSqftHigh,
                      addons: {
                        fridge: result.addonFridge,
                        oven: result.addonOven,
                        secondKitchen: result.addonSecondKitchen,
                      },
                      promo: promoValid
                        ? {
                          code: promoCode.trim().toUpperCase(),
                          amount: result.promoDiscount,
                        }
                        : null,
                    }}
                  />
                </>
              ) : (
                <>
                  <a
                    ref={quoteScheduleBtnRef}
                    href={`tel:${CONTACT.phone}`}
                    onKeyDown={focusQuoteContactButton}
                    className={`${BTN_UPPER} inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-white text-sm font-medium hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300`}
                    aria-label={`Call to book this clean at ${CONTACT.phone}`}
                  >
                    Call to Book This Clean
                  </a>

                  <ContactSheet
                    ref={quoteContactBtnRef}
                    className="min-w-0 flex-1"
                    phone={CONTACT.phone}
                    sms={CONTACT.sms}
                    email={CONTACT.email}
                    onKeyDown={focusQuoteScheduleButton}
                    context={{
                      level: cleanType,
                      sqftLow: result.sqftLow,
                      sqftHigh: result.sqftHigh,
                      sqftInput: result.sqftInput,
                      bedrooms,
                      bathrooms,
                      total: result.totalAfterPromo,
                      totalLow: result.totalAfterPromoLow,
                      ecoProducts: true,
                      cleaners: result.time.cleaners,
                      billableHoursLow: result.billableHoursLow,
                      billableHours: result.billableHours,
                      ratePerSqftLow: result.ratePerSqftLow,
                      ratePerSqftHigh: result.ratePerSqftHigh,
                      addons: {
                        fridge: result.addonFridge,
                        oven: result.addonOven,
                        secondKitchen: result.addonSecondKitchen,
                      },
                      promo: promoValid
                        ? {
                          code: promoCode.trim().toUpperCase(),
                          amount: result.promoDiscount,
                        }
                        : null,
                    }}
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
