"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency } from "../../helpers/contactHelpers.js";
import CalendlyBooking from "./CalendlyBooking";
import ContactSheet from "./ContactSheet";
import SelectField from "../Fields/SelectField.jsx";
import NumberField from "../Fields/NumberField.jsx";
import { CFG, CONTACT, WALKTHROUGH_ARRIVAL_HOURS } from "../../constants.js";
import { buildCalendlyUrlWithUtm } from "../../helpers/calendlyHelpers.js";
import { useRouter } from "next/navigation";
import { BTN_UPPER, HEADING_UPPER, QUOTE_FIELD_LABEL, QUOTE_SECTION_LABEL } from "../../helpers/typography.js";
import { quoteFieldId } from "../../helpers/fieldIds.js";

/**
 * Golden Hour Cleaning Co. — Quote Calculator (Hybrid Sq Ft + Time)
 *
 * Hybrid model:
 * - We estimate TWO square footages:
 *    1) Heuristic from bedrooms (bath count uses 0.5 steps; half = 50% of full time/price)
 *    2) The value you enter in the "Total Sq Ft" field
 * - We use these to create a LOW–HIGH range:
 *    sqftLow  = smaller of (heuristic, entered)
 *    sqftHigh = larger  of (heuristic, entered)
 *    (If no sqft is entered, both = heuristic.)
 *
 * - We then estimate cleaning time from sq ft and clean type
 *   and multiply by an hourly rate behind the scenes to get a
 *   price RANGE. This protects against under-estimating size
 *   while still honoring the customer’s entry.
 *
 * Frequency discounts (applied before eco upcharge):
 * - weekly: 18%
 * - bi-weekly: 12%
 * - monthly: 5%
 * - one-time: 0%
 *
 * Promo:
 * - GOLDENWELCOME = $50 off Deep Clean only; applied to estimated total
 */

const HOURLY_RATE = 75;          // used internally, never shown in UI
const ECO_MULTIPLIER = 1.15;     // 15% upcharge
const SQFT_PER_HOUR_BASE = 290;  // average productivity per cleaner (deep baseline)
const MIN_VISIT_HOURS_ONE_CLEANER = 2;
/** Above this on-site duration with one cleaner, we schedule two cleaners and halve on-site time */
const MAX_ON_SITE_HOURS_ONE_CLEANER = 4;

// We treat anything over 16 total person-hours as a "large job"
const MAX_TOTAL_PERSON_HOURS = 16;

// Deep is baseline (1.0). Standard is faster; Move-Out is slower.
const CLEAN_TYPE_MULTIPLIER = {
  standard: 0.8,
  deep: 1.0,
  move_out: 1.3,
};

/**
 * Add-on configuration
 */
const ADDON_FRIDGE_PRICE = 55;
const ADDON_FRIDGE_HOURS_LOW = 0.5;   // 30 min
const ADDON_FRIDGE_HOURS_HIGH = 1.25; // 75 min

const ADDON_OVEN_PRICE = 55;
const ADDON_OVEN_HOURS_LOW = 0.5;   // 30 min
const ADDON_OVEN_HOURS_HIGH = 1.25; // 75 min

const ADDON_SECOND_KITCHEN_SQFT = 300;
const ADDON_SECOND_KITCHEN_HOURS_LOW = 1.0;  // 60 min
const ADDON_SECOND_KITCHEN_HOURS_HIGH = 1.5; // 90 min

const FULL_BATH_SQFT = CFG.roomsToSqft.perBathroom;

/** Snap to 0.5 increments (e.g. 2.5 = two full + one half). */
function snapBathroomUnits(bathrooms) {
  const n = Number.isFinite(Number(bathrooms)) ? Number(bathrooms) : 0;
  return Math.max(0, Math.round(n * 2) / 2);
}

/** Person-hours one full bath adds at the given clean type (half = 50% of this). */
function fullBathPersonHours(cleanMult) {
  return (FULL_BATH_SQFT * cleanMult) / SQFT_PER_HOUR_BASE;
}

function clampCurrency(n) {
  return Math.max(0, Math.round(n));
}

function formatSigned(amount) {
  const sign = amount >= 0 ? "+" : "−";
  return `${sign}$${Math.abs(amount)}`;
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
  showCalendly,
  setShowCalendly,
  title,
  subtitle = '',
  initialLevel = "deep",
}) {
  const router = useRouter();
  const quoteContactBtnRef = useRef(null);
  const quoteScheduleBtnRef = useRef(null);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [sqft, setSqft] = useState(1800);
  const [frequency, setFrequency] = useState("one_time");

  const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);

  const [cleanType, setCleanType] = useState(() =>
    VALID_LEVELS.has(initialLevel) ? initialLevel : "deep"
  );

  const [ecoProducts, setEcoProducts] = useState(true);
  const [calendlyUrl, setCalendlyUrl] = useState(null);

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

    // Heuristic sqft from beds only; bath time/price applied explicitly below
    const estSqft =
      CFG.roomsToSqft.base + bedrooms * CFG.roomsToSqft.perBedroom;

    const cleanMult = CLEAN_TYPE_MULTIPLIER[cleanType] ?? 1.0;
    const bathPersonHours = bathroomUnits * fullBathPersonHours(cleanMult);

    // Hybrid range from heuristic + entered
    let sqftLow;
    let sqftHigh;

    if (safeSqftInput <= 0) {
      // No usable entry → both ends are heuristic
      sqftLow = estSqft;
      sqftHigh = estSqft;
    } else {
      sqftLow = Math.min(estSqft, safeSqftInput);
      sqftHigh = Math.max(estSqft, safeSqftInput);
    }

    // Second kitchen adds fixed square footage on both ends of the range
    if (includeSecondKitchen) {
      sqftLow += ADDON_SECOND_KITCHEN_SQFT;
      sqftHigh += ADDON_SECOND_KITCHEN_SQFT;
    }

    // Add-ons: extra time + flat prices
    let addonHoursLow = bathPersonHours;
    let addonHoursHigh = bathPersonHours;
    let addonFlat = 0;

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
    }

    // Person-hours for ONE cleaner from sq ft + add-ons
    const billableHoursLowRaw = Math.max(
      MIN_VISIT_HOURS_ONE_CLEANER,
      (sqftLow * cleanMult) / SQFT_PER_HOUR_BASE + addonHoursLow
    );
    const billableHoursHighRaw = Math.max(
      MIN_VISIT_HOURS_ONE_CLEANER,
      (sqftHigh * cleanMult) / SQFT_PER_HOUR_BASE + addonHoursHigh
    );

    // Use two cleaners when one cleaner would be on site more than 4 hours
    const cleaners = billableHoursHighRaw > MAX_ON_SITE_HOURS_ONE_CLEANER ? 2 : 1;

    // On-site time per cleaner
    const onSiteRangeLowRaw = billableHoursLowRaw / cleaners;
    const onSiteRangeHighRaw = billableHoursHighRaw / cleaners;

    const onSiteRangeLow = roundTo(onSiteRangeLowRaw, 0.5);
    const onSiteRangeHigh = roundTo(onSiteRangeHighRaw, 0.5);

    const billableHoursLow = onSiteRangeLow * cleaners;
    const billableHoursHigh = onSiteRangeHigh * cleaners;

    // Total person-hours (used to decide "large job")
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

    // Base labor (time-based) vs flat add-ons — compute separately
    const baseLaborLowRawCore = billableHoursLow * HOURLY_RATE;
    const baseLaborHighRawCore = billableHoursHigh * HOURLY_RATE;

    const baseLaborLowRaw = baseLaborLowRawCore + addonFlat;
    const baseLaborHighRaw = baseLaborHighRawCore + addonFlat;

    const disc = CFG.frequencyDiscount[frequency] || 0;

    const freqDiscountLowRaw = baseLaborLowRaw * disc;
    const subtotalLowAfterFreq = baseLaborLowRaw - freqDiscountLowRaw;

    const freqDiscountHighRaw = baseLaborHighRaw * disc;
    const subtotalHighAfterFreq = baseLaborHighRaw - freqDiscountHighRaw;

    // Eco upcharge
    const ecoMultiplier = ecoProducts ? ECO_MULTIPLIER : 1;

    const totalBeforePromoLowRaw = subtotalLowAfterFreq * ecoMultiplier;
    const ecoUpchargeLowRaw = totalBeforePromoLowRaw - subtotalLowAfterFreq;

    const totalBeforePromoHighRaw = subtotalHighAfterFreq * ecoMultiplier;
    const ecoUpchargeHighRaw = totalBeforePromoHighRaw - subtotalHighAfterFreq;

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
      // For backwards compatibility: "sq ft used for quote" = high end
      usedSqft: Math.round(sqftHigh),

      hourlyRate: HOURLY_RATE,
      billableHoursLow,
      billableHours: billableHoursHigh, // high end
      billableHoursHigh, // alias
      totalPersonHoursHigh,

      // High-end values in the detailed breakdown (most conservative)
      baseLabor: clampCurrency(baseLaborHighRaw),
      baseLaborCore: clampCurrency(baseLaborHighRawCore),
      addonFlatTotal: clampCurrency(addonFlat),
      freqDiscount: clampCurrency(freqDiscountHighRaw),
      ecoUpcharge: clampCurrency(ecoUpchargeHighRaw),
      total: clampCurrency(totalBeforePromoHighRaw),

      promoDiscount: clampCurrency(promoDiscountHigh),

      // Range totals for display
      totalAfterPromoLow,
      totalAfterPromoHigh,
      // Compatibility: "totalAfterPromo" = upper end
      totalAfterPromo: totalAfterPromoHigh,

      walkthroughArrivalHours: WALKTHROUGH_ARRIVAL_HOURS,

      time: {
        cleaners,
        onSiteRangeLow,
        onSiteRangeHigh,
        displayText: timeDisplayText,
      },

      cleanType,
      ecoProducts,
      frequency,

      // Add-ons (for UTM / contact context)
      addonFridge: includeFridge,
      addonOven: includeOven,
      addonSecondKitchen: includeSecondKitchen,
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
    frequency,
    ecoProducts,
    promoValid,
    includeFridge,
    includeOven,
    includeSecondKitchen,
  ]);

  const hasSqftRange = result.sqftLow !== result.sqftHigh;
  const hasHourRange = result.billableHoursLow !== result.billableHours;

  const breakdownSqftLabel = hasSqftRange
    ? `${result.sqftLow.toLocaleString()} to ${result.sqftHigh.toLocaleString()} square feet`
    : `${result.sqftHigh.toLocaleString()} square feet`;

  const quoteHoursLabel = hasHourRange
    ? `${result.billableHoursLow.toFixed(1)} to ${result.billableHours.toFixed(1)} hours of cleaning time`
    : `${result.billableHours.toFixed(1)} ${hoursUnit(result.billableHours)} of cleaning time`;

  const quoteTotalLabel =
    result.totalAfterPromoLow === result.totalAfterPromoHigh
      ? formatCurrency(result.totalAfterPromoHigh)
      : `${formatCurrency(result.totalAfterPromoLow)} to ${formatCurrency(result.totalAfterPromoHigh)}`;

  const breakdownA11yText = useMemo(() => {
    const parts = [];

    parts.push(`Home size used for estimate, ${breakdownSqftLabel}.`);
    parts.push(
      `Cleaning time upper estimate, ${formatCurrency(result.baseLaborCore)}.`
    );

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
        "Second full kitchen, time-based, approximately 60 to 90 minutes."
      );
    }
    if (result.freqDiscount > 0) {
      parts.push(
        `Frequency discount, minus ${formatCurrency(result.freqDiscount)}.`
      );
    }
    if (result.ecoUpcharge > 0) {
      parts.push(
        `Eco-friendly products, 15 percent, plus ${formatCurrency(result.ecoUpcharge)}.`
      );
    }
    if (promoValid) {
      parts.push(
        `Promo golden welcome, minus ${formatCurrency(result.promoDiscount)}.`
      );
    }

    return parts.join(" ");
  }, [result, breakdownSqftLabel, promoValid]);

  const summaryA11yText = useMemo(() => {
    const parts = [];

    parts.push(
      `Estimated total ${quoteTotalLabel}, based on ${breakdownSqftLabel} and ${quoteHoursLabel}.`
    );

    if (!result.isLargeJob) {
      parts.push(
        `Estimated cleaning time on site ${result.time.displayText} with ${result.time.cleaners} ${result.time.cleaners === 1 ? "cleaner" : "cleaners"}.`
      );
      parts.push(
        `Schedule a ${WALKTHROUGH_ARRIVAL_HOURS} ${hoursUnit(WALKTHROUGH_ARRIVAL_HOURS)} arrival window for your in-home walkthrough and final quote. No deposit required to book.`
      );
    } else {
      parts.push(
        "This is a larger project. For accurate scheduling, please call us to book so we can plan enough time and team support."
      );
    }

    parts.push(
      "Final price is confirmed during your in-home walkthrough."
    );

    return parts.join(" ");
  }, [result, breakdownSqftLabel, quoteHoursLabel, quoteTotalLabel]);

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
  const ecoHintId = "quote-eco-hint";
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
          "Instant, size-based pricing with eco-friendly supplies and gentle care."}
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
                result.sqftInput > 0 && result.sqftInput !== result.estSqft
                  ? `${sqftHintId} ${sqftRangeHintId}`
                  : sqftHintId
              }
            />
            <p id={sqftHintId} className="mt-1 text-xs text-stone-500">
              Enter your best estimate. If it looks different from what we’d
              expect based on bedrooms and bathrooms, we’ll show a price range
              between both.
            </p>

            {result.sqftInput > 0 && result.sqftInput !== result.estSqft && (
              <p id={sqftRangeHintId} className="mt-1 text-xs text-stone-500">
                We’re using{" "}
                <span className="font-medium">
                  {result.estSqft.toLocaleString()} sq ft
                </span>{" "}
                (estimated from bedrooms and bathrooms) and{" "}
                <span className="font-medium">
                  {result.sqftInput.toLocaleString()} sq ft
                </span>{" "}
                (your entry) to create this range, so you’re covered even if the
                exact square footage is a bit off.
              </p>
            )}
          </div>
        </fieldset>
      </div>

      <fieldset className="mt-6 rounded-2xl border p-4 relative">
        <legend className={`${QUOTE_SECTION_LABEL} px-1`}>Cleaning options</legend>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span id={cleanTypeLabelId} className={`${QUOTE_FIELD_LABEL} block`}>
              Clean Type
            </span>

            <SelectField
              id={quoteFieldId("clean-type")}
              labelledBy={cleanTypeLabelId}
              describedBy={cleanTypeTipId}
              value={cleanType}
              setValue={setCleanType}
              options={[
                { value: "standard", label: "Standard Clean" },
                { value: "deep", label: "Deep Clean" },
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
          </div>

          {/* Frequency */}
          <SelectField
            label="Frequency"
            value={frequency}
            setValue={setFrequency}
            options={[
              { value: "one_time", label: "One-time" },
              { value: "monthly", label: "Monthly (−5%)" },
              { value: "bi_weekly", label: "Bi-weekly (−12%)" },
              { value: "weekly", label: "Weekly (−18%)" },
            ]}
          />

          <div>
            <span id="eco-products-label" className={`${QUOTE_FIELD_LABEL} block`}>
              Products
            </span>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="eco-products"
                type="checkbox"
                checked={ecoProducts}
                onChange={(e) => setEcoProducts(e.target.checked)}
                aria-labelledby="eco-products-label eco-products-text"
                aria-describedby={ecoHintId}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <span id="eco-products-text" className="text-sm text-stone-700">
                Use eco-friendly products (+15%)
              </span>
            </div>
            <p id={ecoHintId} className="mt-1 text-[11px] text-stone-500">
              Eco is our Golden Hour standard. Uncheck if you prefer
              conventional supplies.
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
                  (+$55, adds approximately 30 to 75 minutes)
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
                  (+$55, adds approximately 30 to 75 minutes)
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
                  (adds approximately 300 square feet and 60 to 90 minutes)
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
              <li className="flex justify-between">
                <span>Home size used for estimate</span>
                <span className="tabular-nums">
                  {hasSqftRange
                    ? `${result.sqftLow.toLocaleString()}–${result.sqftHigh.toLocaleString()} sq ft`
                    : `${result.sqftHigh.toLocaleString()} sq ft`}
                </span>
              </li>

              <li className="flex justify-between">
                <span>Cleaning time (upper estimate)</span>
                <span className="tabular-nums">
                  ${result.baseLaborCore.toLocaleString()}
                </span>
              </li>

              {result.addonFlatTotal > 0 && (
                <>
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
                    <li className="flex justify-between">
                      <span>Second full kitchen</span>
                      <span className="tabular-nums text-xs text-stone-500">
                        time-based (~60–90 min)
                      </span>
                    </li>
                  )}
                </>
              )}

              {result.freqDiscount > 0 && (
                <li className="flex justify-between">
                  <span>Frequency discount</span>
                  <span className="tabular-nums">
                    −${result.freqDiscount.toLocaleString()}
                  </span>
                </li>
              )}

              {result.ecoUpcharge > 0 && (
                <li className="flex justify-between">
                  <span>Eco-friendly products (+15%)</span>
                  <span className="tabular-nums">
                    {formatSigned(result.ecoUpcharge)}
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
                    {hasSqftRange || hasHourRange ? "Estimated range " : "Estimated "}
                    based on{" "}
                    {hasSqftRange ? (
                      <>
                        {result.sqftLow.toLocaleString()}–{" "}
                        {result.sqftHigh.toLocaleString()} sq ft
                      </>
                    ) : (
                      <>{result.sqftHigh.toLocaleString()} sq ft</>
                    )}{" "}
                    and{" "}
                    {hasHourRange ? (
                      <>
                        {result.billableHoursLow.toFixed(1)}–{" "}
                        {result.billableHours.toFixed(1)}{" "}
                        {hoursUnit(result.billableHours)}
                      </>
                    ) : (
                      <>
                        {result.billableHours.toFixed(1)}{" "}
                        {hoursUnit(result.billableHours)}
                      </>
                    )}{" "}
                    of cleaning time.
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
                    When you schedule, you&apos;ll pick a{" "}
                    <span className="font-medium">
                      {WALKTHROUGH_ARRIVAL_HOURS}{" "}
                      {hoursUnit(WALKTHROUGH_ARRIVAL_HOURS)}
                    </span>{" "}
                    arrival window for your in-home walkthrough and final quote.
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
                    className={`${BTN_UPPER} inline-flex w-full min-w-0 flex-1 items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300`}
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
                      frequency,
                      ecoProducts,
                      cleaners: result.time.cleaners,
                      billableHoursLow: result.billableHoursLow,
                      billableHours: result.billableHours,
                      hourlyRate: result.hourlyRate,
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
                      frequency,
                      ecoProducts,
                      cleaners: result.time.cleaners,
                      billableHoursLow: result.billableHoursLow,
                      billableHours: result.billableHours,
                      hourlyRate: result.hourlyRate,
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

            <p className="mt-2 text-xs text-stone-600" aria-hidden="true">
              Final price is confirmed during your in-home walkthrough. No deposit
              required to schedule.
            </p>
          </section>
        </div>
      </div>

      <CalendlyBooking
        url={calendlyUrl}
        isOpen={showCalendly}
        setOpen={setShowCalendly}
      />
    </section>
  );
}
