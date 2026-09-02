"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, Info } from "lucide-react";
import { formatCurrency } from "../../helpers/contactHelpers.js";
import ContactSheet from "./ContactSheet";
import SelectField from "../Fields/SelectField.jsx";
import NumberField from "../Fields/NumberField.jsx";
import { CFG, CONTACT, LEVEL_COPY, WALKTHROUGH_ARRIVAL_HOURS } from "../../constants.js";
import { sqftHeuristicForBedrooms } from "../../lib/quotePricing.js";
import { buildCalendlyUrlWithUtm } from "../../helpers/calendlyHelpers.js";
import { trackCalendlyClick } from "../../helpers/calendlyAnalytics";
import { getPpcAttribution } from "../../helpers/ppcAttribution";
import { trackQuoteViewed } from "../../helpers/quoteViewAnalytics";
import { useQuoteResultsInView } from "../../helpers/useQuoteResultsInView";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BTN_UPPER, HEADING_UPPER, QUOTE_FIELD_LABEL, QUOTE_SECTION_LABEL } from "../../helpers/typography.js";
import { quoteFieldId } from "../../helpers/fieldIds.js";
import {
  asFiniteNumber,
  readQuoteDraft,
  writeQuoteDraft,
} from "../../helpers/quoteDraftStorage";

/**
 * Golden Hour Cleaning Co. — Quote Calculator
 *
 * Pricing model:
 * - Prefer the entered square footage as the floor
 * - Bedroom heuristic (base + beds × per bedroom) only when bedrooms > 0 and
 *   higher than the entry (guards understated size; does not pull large homes down)
 * - Standard, deep, and move-out use separate living-area and bathroom rate bands
 * - Price (deep / move-out, typical): (home sq ft + baths × 150) × rate
 * - When baths × 150 ≥ home size: price uses bathroom rate only
 * - Deep cleans use a condition-based rate range (low–high)
 * - Minimum base visit charge: standard $150, deep $250, move-out $350
 * - Flat add-ons (fridge, oven, second kitchen) are added after
 *
 * Hours model (approximate, for scheduling only — does not set price):
 * - Convert size + bathrooms + add-ons + second kitchen into person-hours
 * - Bathrooms use a 1.5× time multiplier only when baths × 150 ≥ home size
 * - Deep cleans span productivity bands from straightforward to moderate
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

/** Internal living-area rates by clean type (low–high). */
const RATE_PER_SQFT = {
  standard: { low: 0.14, high: 0.2 },
  deep: { low: DEEP_RATE_PER_SQFT_LOW, high: DEEP_RATE_PER_SQFT_HIGH },
  move_out: { low: 0.4, high: 0.5 },
};

/** Bathroom care rates by clean type (denser than living areas). */
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
  move_out: { fast: 225, slow: 180 },
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

function moneyLabel(n) {
  return `$${Number(n).toLocaleString()}`;
}

const CONDITION_BANDS = [
  {
    id: "light",
    title: "Light buildup",
    shortLabel: "Light",
    summary: ["Minimal", "buildup"],
    desc: "Regularly maintained with minimal dust, grease, soap scum and pet hair.",
    barClass: "bg-amber-100",
    cardClass: "bg-amber-100/25",
  },
  {
    id: "moderate",
    title: "Moderate buildup",
    shortLabel: "Moderate",
    summary: ["Typical", "buildup"],
    badge: "Most common",
    desc: "Typical lived-in condition with visible dust, bathroom/kitchen buildup, soap scum or pet hair.",
    barClass: "bg-amber-300",
    cardClass: "bg-amber-300/20",
  },
  {
    id: "heavy",
    title: "Heavy buildup",
    shortLabel: "Heavy",
    summary: ["Significant", "buildup"],
    desc: "Significant accumulated dust, grease, soap scum, pet hair or grime; areas may not have been thoroughly cleaned for some time.",
    barClass: "bg-[#dcbb52]",
    cardClass: "bg-[#dcbb52]/15",
  },
];

function splitConditionBands(low, high) {
  const lo = Math.round(Number(low) || 0);
  const hi = Math.round(Number(high) || 0);
  if (hi <= lo) return null;
  const span = hi - lo;
  const third = Math.max(1, Math.floor(span / 3));
  const lightHigh = Math.min(lo + third - 1, hi - 2);
  const modLow = lightHigh + 1;
  const modHigh = Math.min(modLow + third - 1, hi - 1);
  return [
    { ...CONDITION_BANDS[0], low: lo, high: lightHigh },
    { ...CONDITION_BANDS[1], low: modLow, high: modHigh },
    { ...CONDITION_BANDS[2], low: modHigh + 1, high: hi },
  ];
}

function ConditionRangeVisual({ low, high }) {
  const bands = splitConditionBands(low, high);
  if (!bands) return null;

  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
        How condition affects your estimate
      </p>

      <div
        className="mt-4 flex min-h-[3.75rem] overflow-hidden rounded-full border border-stone-200 md:min-h-[4.25rem]"
        role="img"
        aria-label={`Price range by home condition: light ${moneyLabel(bands[0].low)} to ${moneyLabel(bands[0].high)}, moderate ${moneyLabel(bands[1].low)} to ${moneyLabel(bands[1].high)}, heavy ${moneyLabel(bands[2].low)} to ${moneyLabel(bands[2].high)}.`}
      >
        {bands.map((band) => (
          <div
            key={band.id}
            className={`flex min-w-0 flex-1 flex-col items-center justify-center px-0.5 py-2 text-center sm:px-1 ${band.barClass}`}
          >
            <span className="text-xs font-semibold uppercase leading-tight tracking-wide text-stone-800">
              {band.shortLabel}
            </span>
            <span className="text-base font-semibold tabular-nums leading-tight text-stone-800">
              {moneyLabel(band.low)}–{moneyLabel(band.high)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-snug text-stone-600 md:hidden">
        Your home&apos;s condition determines where your estimate falls
        within this range. We consider accumulated dust, grease, soap scum,
        pet hair, grime and overall buildup.
      </p>

      <ul className="mt-4 hidden grid-cols-3 gap-3 md:grid">
        {bands.map((band) => (
          <li
            key={band.id}
            className={`rounded-xl px-4 py-3 ${band.cardClass}`}
          >
            <p className="text-sm font-semibold text-stone-900">
              {band.title}
              {band.badge ? (
                <span className="ml-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                  {band.badge}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-stone-600">
              {band.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuoteStepHeader({ step, children, id }) {
  return (
    <div id={id} className="flex w-full items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fde68a] text-sm font-semibold text-stone-900">
        {step}
      </span>
      <span className={QUOTE_SECTION_LABEL}>{children}</span>
    </div>
  );
}

const QUOTE_CARD =
  "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8";

const QUOTE_HINT = "mt-4 text-sm leading-relaxed text-stone-500";

export const BOOKING_HEADER_BAND =
  "relative w-screen max-w-[100vw] overflow-x-clip bg-[#a7eff1] [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]";

function QuoteCalculatorIntro() {
  return (
    <div id="quote-calculator-desc" className="mt-4 text-center">
      <p className="text-sm leading-relaxed text-stone-600 md:text-base">
        See your estimated price in about 30 seconds,
        <br />
        then choose a cleaning time that works for you.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-stone-600">
        <span>⚡ Instant estimate</span>
        <span>📅 Live availability</span>
        <span>🔒 Secure booking</span>
      </div>
    </div>
  );
}

export function QuoteCalculatorBookingHeader({ title }) {
  return (
    <>
      <h2
        id="quote-calculator-heading"
        tabIndex={-1}
        className={`text-center text-2xl md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
      >
        {title}
      </h2>
      <QuoteCalculatorIntro />
    </>
  );
}

/**
 * @param {{
 *   title?: string,
 *   subtitle?: string,
 *   initialLevel?: "standard" | "deep" | "move_out",
 *   hideHeader?: boolean,
 * }} props
 */
export default function QuoteCalculator({
  title = "",
  subtitle = '',
  initialLevel,
  hideHeader = false,
}) {
  const router = useRouter();
  const quoteContactBtnRef = useRef(null);
  const quoteScheduleBtnRef = useRef(null);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(0);

  const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
  const hasExplicitLevel = VALID_LEVELS.has(initialLevel);

  const [cleanType, setCleanType] = useState(() =>
    hasExplicitLevel ? initialLevel : "deep"
  );

  // Add-ons
  const [includeFridge, setIncludeFridge] = useState(false);
  const [includeOven, setIncludeOven] = useState(false);
  const [includeSecondKitchen, setIncludeSecondKitchen] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [showMobileValueDetails, setShowMobileValueDetails] = useState(false);

  useEffect(() => {
    if (VALID_LEVELS.has(initialLevel)) {
      setCleanType(initialLevel);
      return;
    }

    // Header Instant Quote clears `level` from the URL — use storage, else deep.
    const draft = readQuoteDraft();
    if (draft && VALID_LEVELS.has(draft.cleanType)) {
      setCleanType(draft.cleanType);
    } else {
      setCleanType("deep");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevel]);

  useEffect(() => {
    if (cleanType === "move_out") {
      setIncludeFridge(false);
      setIncludeOven(false);
    }
  }, [cleanType]);

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

  useEffect(() => {
    const draft = readQuoteDraft();
    if (!draft) return;

    if (draft.bedrooms != null) setBedrooms(asFiniteNumber(draft.bedrooms, 3));
    if (draft.bathrooms != null) setBathrooms(asFiniteNumber(draft.bathrooms, 2));
    if (draft.sqft != null) setSqft(asFiniteNumber(draft.sqft, 0));
    // URL/prop level wins over a saved draft (e.g. service card Instant Quote)
    if (!VALID_LEVELS.has(initialLevel) && VALID_LEVELS.has(draft.cleanType)) {
      setCleanType(draft.cleanType);
    }
    if (typeof draft.includeFridge === "boolean") setIncludeFridge(draft.includeFridge);
    if (typeof draft.includeOven === "boolean") setIncludeOven(draft.includeOven);
    if (typeof draft.includeSecondKitchen === "boolean") {
      setIncludeSecondKitchen(draft.includeSecondKitchen);
    }
    if (typeof draft.promoCode === "string") setPromoCode(draft.promoCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipQuoteDraftSave = useRef(true);
  useEffect(() => {
    if (skipQuoteDraftSave.current) {
      skipQuoteDraftSave.current = false;
      return;
    }
    writeQuoteDraft({
      bedrooms,
      bathrooms,
      sqft,
      cleanType,
      includeFridge,
      includeOven,
      includeSecondKitchen,
      promoCode,
    });
  }, [
    bedrooms,
    bathrooms,
    sqft,
    cleanType,
    includeFridge,
    includeOven,
    includeSecondKitchen,
    promoCode,
  ]);

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
    // Bathrooms add denser care as +150 sq ft each at the base rate.
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

    // Hours: approximate only (scheduling).
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
    // When baths dominate home size: (baths×150) × bathroom rate only.
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
      // Living areas + bathrooms at their respective rate bands
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
      // Floor low end to minimum when under; high end stays at computed rate
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
  const bathsDominate = result.bathsDominateHome;

  const bathEstimateLabel =
    result.bathrooms === 1
      ? `1 bath × ~${FULL_BATH_SQFT} = ~${result.bathAreaSqft.toLocaleString()} sq ft`
      : `${result.bathrooms} baths × ~${FULL_BATH_SQFT} = ~${result.bathAreaSqft.toLocaleString()} sq ft`;
  const estimatedTypeLabel =
    cleanType === "move_out"
      ? "move-out"
      : cleanType === "standard"
        ? "standard"
        : "deep";
  const bathCountLabel =
    result.bathrooms === 1 ? "1 bath" : `${result.bathrooms} baths`;

  const sizeLabel = bathsDominate
    ? bathEstimateLabel
    : hasSqftRange
      ? `${result.sqftLow.toLocaleString()} to ${result.sqftHigh.toLocaleString()} square feet`
      : `${result.sqftHigh.toLocaleString()} square feet`;

  const quoteTotalLabel =
    result.totalAfterPromoLow === result.totalAfterPromoHigh
      ? formatCurrency(result.totalAfterPromoHigh)
      : `${formatCurrency(result.totalAfterPromoLow)} to ${formatCurrency(result.totalAfterPromoHigh)}`;

  const conditionBands = useMemo(
    () =>
      splitConditionBands(
        result.totalAfterPromoLow,
        result.totalAfterPromoHigh
      ),
    [result.totalAfterPromoLow, result.totalAfterPromoHigh]
  );

  const quoteResultsRef = useQuoteResultsInView(() => {
    trackQuoteViewed({
      quoteLow: result.totalAfterPromoLow,
      quoteHigh: result.totalAfterPromoHigh,
      cleanType,
    });
  });

  const summaryA11yText = useMemo(() => {
    const parts = [];

    parts.push(
      result.fullyAtMinimum
        ? `Estimated total ${quoteTotalLabel}, minimum visit charge.`
        : result.minOnLowOnly
          ? `Estimated total ${quoteTotalLabel}, low end is our minimum visit charge; high end based on ${bathsDominate ? bathCountLabel : `${result.sqftHigh.toLocaleString()} square feet`}.`
          : `Estimated total ${quoteTotalLabel}, based on ${bathsDominate ? bathCountLabel : sizeLabel}.`
    );

    if (conditionBands) {
      parts.push(
        `Your final price depends on the condition of the home at your walkthrough. Light buildup ${moneyLabel(conditionBands[0].low)} to ${moneyLabel(conditionBands[0].high)}. Moderate buildup, most common, ${moneyLabel(conditionBands[1].low)} to ${moneyLabel(conditionBands[1].high)}. Heavy buildup ${moneyLabel(conditionBands[2].low)} to ${moneyLabel(conditionBands[2].high)}. We'll assess your home's condition during your walkthrough and confirm your final price before cleaning begins.`
      );
    }

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
    sizeLabel,
    quoteTotalLabel,
    bathsDominate,
    bathCountLabel,
    conditionBands,
  ]);

  const quoteResultsA11yText = summaryA11yText;

  const roomsHintId = "quote-rooms-hint";
  const sqftHintId = "quote-sqft-hint";
  const cleanTypeLabelId = "quote-clean-type-label";
  const cleanTypeTipId = "quote-clean-type-tip";
  const cleanTypeNoteId = "quote-clean-type-note";
  const promoHintId = "quote-promo-hint";
  const promoErrorId = "quote-promo-error";
  const promoSuccessId = "quote-promo-success";
  const quoteHeadingId = "quote-summary-heading";
  const quoteResultsHeadingId = "quote-results-heading";
  const quoteResultsDescId = "quote-results-a11y-desc";
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

    const attribution = getPpcAttribution();
    const calendlyUrl = buildCalendlyUrlWithUtm(
      CONTACT.bookingUrl,
      result,
      {
        applied: promoValid,
        code: promoCode.trim().toUpperCase(),
        amount: promoValid ? 50 : 0,
      },
      attribution
    );

    trackCalendlyClick({
      source: "quote_calculator",
      url: calendlyUrl,
      cleanType: cleanType,
      attribution,
    });

    sessionStorage.setItem("calendlyUrl", calendlyUrl);
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    router.push("/book");
  }

  return (
    <section
      id="quote-calculator"
      aria-labelledby="quote-calculator-heading"
      className="mx-auto max-w-3xl px-4"
    >
      {!hideHeader &&
        (subtitle ? (
          <>
            <h2
              id="quote-calculator-heading"
              tabIndex={-1}
              className={`text-center text-2xl md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
            >
              {title}
            </h2>
            <p id="quote-calculator-desc" className="mt-3 text-center text-sm leading-relaxed text-stone-600 md:text-base">
              {subtitle}
            </p>
          </>
        ) : (
          <div className={`${BOOKING_HEADER_BAND} px-4 pb-8 pt-10`}>
            <div className="mx-auto max-w-3xl">
              <QuoteCalculatorBookingHeader title={title} />
            </div>
          </div>
        ))}

      <div className={hideHeader ? "space-y-5" : "mt-8 space-y-5"}>
        <fieldset className={QUOTE_CARD} aria-labelledby="quote-step-1-heading">
          <legend className="sr-only">Bedrooms and bathrooms</legend>
          <QuoteStepHeader step={1} id="quote-step-1-heading">
            Bedrooms &amp; Bathrooms
          </QuoteStepHeader>
          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-start">
            <div className="min-w-0 pr-4 sm:pr-10">
              <NumberField
                label="Bedrooms"
                value={bedrooms}
                setValue={setBedrooms}
                min={0}
                showStepper
                describedBy={roomsHintId}
              />
            </div>
            <div className="w-px self-stretch bg-stone-200" aria-hidden />
            <div className="min-w-0 pl-4 sm:pl-10">
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
          </div>
          <p id={roomsHintId} className={QUOTE_HINT}>
            Select how many bedrooms and bathrooms you&apos;d like us to care for.
          </p>
        </fieldset>

        <fieldset className={QUOTE_CARD} aria-labelledby="quote-step-2-heading">
          <legend className="sr-only">Square feet</legend>
          <QuoteStepHeader step={2} id="quote-step-2-heading">
            Square Feet
          </QuoteStepHeader>
          <div className="mt-6">
            <NumberField
              label="Total Sq Ft"
              value={sqft}
              setValue={setSqft}
              min={0}
              step={50}
              describedBy={sqftHintId}
            />
            <p id={sqftHintId} className="mt-4 text-sm leading-snug text-stone-500">
              Please enter your home&apos;s square footage as accurately as possible so we can provide a reliable quote and plan appropriate staffing. Your home&apos;s size and condition will be confirmed during the initial walkthrough, and your online quote is subject to change based on that assessment.
            </p>
          </div>
        </fieldset>

        <fieldset className={QUOTE_CARD} aria-labelledby="quote-step-3-heading">
          <legend className="sr-only">Cleaning options</legend>
          <QuoteStepHeader step={3} id="quote-step-3-heading">
            Cleaning Options
          </QuoteStepHeader>
          <div className="mt-6">
            <span id={cleanTypeLabelId} className={`${QUOTE_FIELD_LABEL} block`}>
              Clean Type
            </span>

            <SelectField
              id={quoteFieldId("clean-type")}
              labelledBy={cleanTypeLabelId}
              describedBy={
                cleanType === "standard"
                  ? `${cleanTypeTipId} ${cleanTypeNoteId}`
                  : cleanTypeTipId
              }
              value={cleanType}
              setValue={setCleanType}
              options={[
                { value: "deep", label: "Deep Clean" },
                { value: "standard", label: "Standard Clean" },
                { value: "move_out", label: "Move-In / Move-Out" },
              ]}
            />
            <p id={cleanTypeTipId} className={QUOTE_HINT}>
              View our{" "}
              <a
                href="/residential/services"
                className="font-medium text-stone-700 underline underline-offset-2 hover:text-stone-900"
              >
                Residential Services
              </a>{" "}
              for details on what each clean type includes.
            </p>
            {cleanType === "standard" && (
              <div
                id={cleanTypeNoteId}
                role="note"
                className="mt-3 flex gap-3 rounded-xl border border-amber-300 bg-amber-200 px-4 py-3"
              >
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-800"
                  strokeWidth={2}
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-amber-950">
                  Note: Standard cleans are reserved for recurring customers or homes
                  that have had a professional cleaning within the past 2–4 weeks.
                </p>
              </div>
            )}

            <div className="mt-6 border-t border-stone-200 pt-6">
              <label htmlFor="promo-code" className={`${QUOTE_FIELD_LABEL} block`}>
                Promo code
              </label>
              <div className="mt-2">
                <input
                  id="promo-code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
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
                <p id={promoErrorId} role="alert" className="mt-2 text-xs text-red-600">
                  {promoError}
                </p>
              )}
              {promoValid && !promoError && (
                <p id={promoSuccessId} className="mt-2 text-xs text-green-700">
                  Code applied: minus $50
                </p>
              )}
              <p id={promoHintId} className="mt-2 text-sm text-stone-500">
                Applies to Deep Clean only. Discount reduces the estimated total.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className={QUOTE_CARD} aria-labelledby="quote-step-4-heading">
          <legend className="sr-only">Optional add-ons</legend>
          <QuoteStepHeader step={4} id="quote-step-4-heading">
            Add-Ons (Optional)
          </QuoteStepHeader>
          {cleanType === "move_out" && (
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              Inside fridge and inside oven are included with move-in / move-out
              cleaning.
            </p>
          )}
          <div
            role="group"
            aria-labelledby="quote-addons-label"
            className={`space-y-3 text-sm text-stone-700 ${cleanType === "move_out" ? "mt-4" : "mt-6"}`}
          >
            <span id="quote-addons-label" className="sr-only">
              Optional add-ons
            </span>
            {cleanType === "move_out" ? (
              <>
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3">
                  <span
                    className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-300 bg-amber-100 text-amber-900"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <div>
                    <span className="font-medium text-stone-900">Inside fridge</span>{" "}
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#b8952e]">
                      Included
                    </span>
                    <p className="mt-0.5 text-stone-500">
                      Included with move-in / move-out cleaning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3">
                  <span
                    className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-amber-300 bg-amber-100 text-amber-900"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <div>
                    <span className="font-medium text-stone-900">Inside oven</span>{" "}
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#b8952e]">
                      Included
                    </span>
                    <p className="mt-0.5 text-stone-500">
                      Included with move-in / move-out cleaning.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
                  <input
                    id="addon-fridge"
                    type="checkbox"
                    checked={includeFridge}
                    onChange={(e) => setIncludeFridge(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
                  />
                  <label htmlFor="addon-fridge">
                    <span className="font-medium text-stone-900">Inside fridge</span>{" "}
                    <span className="text-stone-500">
                      (+${ADDON_FRIDGE_PRICE}, adds approximately 30 to 75 minutes)
                    </span>
                  </label>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
                  <input
                    id="addon-oven"
                    type="checkbox"
                    checked={includeOven}
                    onChange={(e) => setIncludeOven(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
                  />
                  <label htmlFor="addon-oven">
                    <span className="font-medium text-stone-900">Inside oven</span>{" "}
                    <span className="text-stone-500">
                      (+${ADDON_OVEN_PRICE}, adds approximately 30 to 75 minutes)
                    </span>
                  </label>
                </div>
              </>
            )}

            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
              <input
                id="addon-second-kitchen"
                type="checkbox"
                checked={includeSecondKitchen}
                onChange={(e) => setIncludeSecondKitchen(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor="addon-second-kitchen">
                <span className="font-medium text-stone-900">Second full kitchen</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_SECOND_KITCHEN_FEE_LOW}–${ADDON_SECOND_KITCHEN_FEE_HIGH}+, adds
                  approximately 60 to 90 minutes)
                </span>
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div
        ref={quoteResultsRef}
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

        <section
          aria-labelledby={quoteHeadingId}
          aria-describedby={quoteSummaryA11yId}
          className={`${QUOTE_CARD} relative bg-[#fffbea]`}
        >
          <p id={quoteSummaryA11yId} className="sr-only">
            {summaryA11yText}
          </p>

          <button
            type="button"
            className="absolute top-2 right-1 inline-flex flex-col items-start justify-center rounded-xl border border-[#a7eff1]/80 bg-[#a7eff1]/20 py-1 pl-1.5 pr-1 text-left text-xs font-bold leading-tight !normal-case !tracking-normal text-stone-800 md:hidden"
            style={{ textTransform: "none", letterSpacing: "normal" }}
            onClick={() => setShowMobileValueDetails((current) => !current)}
            aria-expanded={showMobileValueDetails}
          >
            <span>
              Comparing another
              <br />
              <span className="inline-flex items-center gap-1.5">
                quote?
                <Info className="h-3 w-3 shrink-0" aria-hidden />
              </span>
            </span>
          </button>

          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-5 md:gap-8">
            <div className="md:col-span-3">
              <div className="pr-24 md:pr-0">
                <h3 id={quoteHeadingId} className={QUOTE_SECTION_LABEL}>
                  Your estimated
                  <br className="md:hidden" />
                  <span className="hidden md:inline"> </span>{estimatedTypeLabel} clean
                </h3>
                <p className="mt-3 whitespace-nowrap text-3xl font-semibold tabular-nums md:text-4xl" aria-hidden="true">
                  {result.totalAfterPromoLow === result.totalAfterPromoHigh
                    ? formatCurrency(result.totalAfterPromoHigh)
                    : `${formatCurrency(
                      result.totalAfterPromoLow
                    )} – ${formatCurrency(result.totalAfterPromoHigh)}`}
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  {result.bedrooms} {result.bedrooms === 1 ? "bedroom" : "bedrooms"}
                  {" · "}
                  {result.bathrooms}{" "}
                  {result.bathrooms === 1 ? "bathroom" : "bathrooms"}
                  {" · "}
                  <span className="whitespace-nowrap">
                    {(result.sqftInput > 0
                      ? result.sqftInput
                      : result.estSqft
                    ).toLocaleString()} sq ft
                    {result.sqftInput <= 0 && <span className="text-stone-400"> (est.)</span>}
                  </span>
                </p>
              </div>
              <div className="md:hidden">
                {showMobileValueDetails && (
                  <div className="mt-2 space-y-2 rounded-xl border border-[#a7eff1]/70 bg-[#a7eff1]/35 px-4 py-3 text-sm leading-relaxed text-stone-600">
                    <p>
                      Not all cleaning quotes include the same scope. Lower prices
                      may reflect a more limited service or separately priced
                      add-ons.
                    </p>
                    <p>
                      Our {(LEVEL_COPY[cleanType]?.name ?? "deep clean").toLowerCase()} includes a comprehensive scope backed by our{" "}
                      <Link
                        href="/satisfaction-guarantee"
                        className="font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                      >
                        Satisfaction Guarantee
                      </Link>
                      .
                    </p>
                    <Link
                      href={`/residential/services/${cleanType === "move_out" ? "move-out" : cleanType}#whats-included`}
                      className="inline-block font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                    >
                      Compare what&apos;s included &rarr;
                    </Link>
                  </div>
                )}
              </div>
              <p className="mt-6 hidden text-sm leading-snug text-stone-600 md:block">
                This online quote is based on the information provided and is
                subject to change. We&apos;ll assess your home&apos;s{" "}
                <strong className="font-bold">actual size and condition</strong>{" "}
                during the initial walkthrough and confirm
                your final price before cleaning begins.
              </p>
            </div>

            <aside className="hidden rounded-xl border border-[#a7eff1]/70 bg-[#a7eff1]/35 px-4 py-3 md:col-span-2 md:block">
              <p className="text-base font-semibold text-stone-900">
                Comparing another quote?
              </p>
              <p className="mt-1.5 text-sm leading-snug text-stone-600 sm:mt-2 sm:leading-relaxed">
                Not all cleaning quotes include the same scope. Lower prices may
                reflect a more limited service or separately priced add-ons.
              </p>
              <p className="mt-1.5 text-sm leading-snug text-stone-600 sm:mt-2 sm:leading-relaxed">
                Ours includes a detailed,{" "}
                <Link
                  href={`/residential/services/${cleanType === "move_out" ? "move-out" : cleanType}#whats-included`}
                  className="font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                >
                  comprehensive clean
                </Link>{" "}
                backed by our{" "}
                <Link
                  href="/satisfaction-guarantee"
                  className="font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                >
                  Satisfaction Guarantee
                </Link>
                .
              </p>
            </aside>
          </div>

          <div aria-hidden="true">
            <ConditionRangeVisual
              low={result.totalAfterPromoLow}
              high={result.totalAfterPromoHigh}
            />
          </div>

          <p className="mt-6 text-sm leading-snug text-stone-600 md:hidden">
            This online quote is based on the information provided and is
            subject to change. We&apos;ll assess your home&apos;s{" "}
            <strong className="font-bold">actual size and condition</strong>{" "}
            during the initial walkthrough and confirm
            your final price before cleaning begins.
          </p>

          <div aria-hidden="true">

            {!result.isLargeJob && (
              <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">
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
              <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4 text-xs text-stone-700">
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
                  className={`${BTN_UPPER} inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300`}
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
                  data-call-source="quote_call_to_book"
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
    </section>
  );
}
