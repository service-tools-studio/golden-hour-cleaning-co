"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { CONTACT, WALKTHROUGH_ARRIVAL_HOURS } from "@/constants.js";
import { formatCurrency } from "@/helpers/contactHelpers.js";
import { quoteFieldId } from "@/helpers/fieldIds.js";
import {
  BTN_UPPER,
  HEADING_UPPER,
  QUOTE_SECTION_LABEL,
} from "@/helpers/typography.js";
import NumberField from "@/components/Fields/NumberField.jsx";
import DeepCleanConditionRange from "@/components/ppc/DeepCleanConditionRange";
import {
  ADDON_FRIDGE_PRICE,
  ADDON_OVEN_PRICE,
  ADDON_SECOND_KITCHEN_FEE_HIGH,
  ADDON_SECOND_KITCHEN_FEE_LOW,
  calculateQuote,
} from "@/lib/quotePricing";
import { buildPpcCalendlyUrl } from "@/helpers/ppcCalendlyUrl";
import {
  getPpcAttribution,
  type PpcAttribution,
} from "@/helpers/ppcAttribution";
import {
  asFiniteNumber,
  readQuoteDraft,
  writeQuoteDraft,
} from "@/helpers/quoteDraftStorage";

const QUOTE_CARD =
  "rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8";
const QUOTE_HINT = "mt-4 text-sm leading-relaxed text-stone-500";
const GOLD_BTN = `${BTN_UPPER} inline-flex w-full items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`;

function QuoteStepHeader({
  step,
  children,
  id,
}: {
  step: number;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="flex w-full items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fde68a] text-sm font-semibold text-stone-900">
        {step}
      </span>
      <span className={QUOTE_SECTION_LABEL}>{children}</span>
    </div>
  );
}

export default function DeepCleanQuoteCalculator({
  attribution,
  onQuoteStarted,
  onQuoteCompleted,
  onCalendlyOpened,
  onCalendlyUrlChange,
}: {
  attribution: PpcAttribution;
  onQuoteStarted?: () => void;
  onQuoteCompleted?: (result: ReturnType<typeof calculateQuote>) => void;
  onCalendlyOpened?: () => void;
  onCalendlyUrlChange?: (url: string) => void;
}) {
  const [bedrooms, setBedrooms] = useState(() =>
    asFiniteNumber(readQuoteDraft()?.bedrooms, 3)
  );
  const [bathrooms, setBathrooms] = useState(() =>
    asFiniteNumber(readQuoteDraft()?.bathrooms, 2)
  );
  const [sqft, setSqft] = useState(() =>
    asFiniteNumber(readQuoteDraft()?.sqft, 0)
  );
  const [includeFridge, setIncludeFridge] = useState(
    () => Boolean(readQuoteDraft()?.includeFridge)
  );
  const [includeOven, setIncludeOven] = useState(
    () => Boolean(readQuoteDraft()?.includeOven)
  );
  const [includeSecondKitchen, setIncludeSecondKitchen] = useState(
    () => Boolean(readQuoteDraft()?.includeSecondKitchen)
  );
  const [showMobileValueDetails, setShowMobileValueDetails] = useState(false);
  const [confirmLowSqft, setConfirmLowSqft] = useState(false);
  const [sqftSettled, setSqftSettled] = useState(false);
  const sqftSettledTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roomsHintId = "ppc-quote-rooms-hint";
  const sqftHintId = "ppc-quote-sqft-hint";
  const sqftRangeHintId = "ppc-quote-sqft-range-hint";

  const result = useMemo(
    () =>
      calculateQuote({
        bedrooms,
        bathrooms,
        sqft,
        cleanType: "deep",
        promoValid: false,
        includeFridge,
        includeOven,
        includeSecondKitchen,
        confirmLowSqft,
      }),
    [
      bedrooms,
      bathrooms,
      sqft,
      includeFridge,
      includeOven,
      includeSecondKitchen,
      confirmLowSqft,
    ]
  );

  useEffect(() => {
    setSqftSettled(false);
    if (sqftSettledTimer.current) clearTimeout(sqftSettledTimer.current);
    if (sqft > 0) {
      sqftSettledTimer.current = setTimeout(() => setSqftSettled(true), 800);
    }
    return () => {
      if (sqftSettledTimer.current) clearTimeout(sqftSettledTimer.current);
    };
  }, [sqft]);

  const showSqftGuardrail = result.sqftGuardrailTriggered && sqftSettled;

  const calendlyUrl = useMemo(
    () =>
      buildPpcCalendlyUrl(
        result,
        {
          applied: false,
          code: "",
          amount: 0,
        },
        { ...getPpcAttribution(), ...attribution }
      ),
    [result, attribution]
  );

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
      includeFridge,
      includeOven,
      includeSecondKitchen,
    });
  }, [
    bedrooms,
    bathrooms,
    sqft,
    includeFridge,
    includeOven,
    includeSecondKitchen,
  ]);

  useEffect(() => {
    onCalendlyUrlChange?.(calendlyUrl);
  }, [calendlyUrl, onCalendlyUrlChange]);

  function markStarted() {
    onQuoteStarted?.();
  }

  function openCalendly(event: MouseEvent<HTMLAnchorElement>) {
    const url = buildPpcCalendlyUrl(
      result,
      {
        applied: false,
        code: "",
        amount: 0,
      },
      getPpcAttribution()
    );
    event.currentTarget.href = url;
    onCalendlyUrlChange?.(url);
    onQuoteCompleted?.(result);
    onCalendlyOpened?.();
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="space-y-6">
        <fieldset className={QUOTE_CARD} aria-labelledby="ppc-quote-step-1">
          <legend className="sr-only">Bedrooms and bathrooms</legend>
          <QuoteStepHeader step={1} id="ppc-quote-step-1">
            Bedrooms &amp; Bathrooms
          </QuoteStepHeader>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <NumberField
              id={quoteFieldId("ppc-bedrooms")}
              label="Bedrooms"
              value={bedrooms}
              setValue={(value: number) => {
                markStarted();
                setBedrooms(value);
                setConfirmLowSqft(false);
              }}
              min={0}
              step={1}
              showStepper
              describedBy={roomsHintId}
            />
            <NumberField
              id={quoteFieldId("ppc-bathrooms")}
              label="Bathrooms"
              value={bathrooms}
              setValue={(value: number) => {
                markStarted();
                setBathrooms(value);
              }}
              min={0}
              step={0.5}
              showStepper
              describedBy={roomsHintId}
            />
          </div>
          <p id={roomsHintId} className={QUOTE_HINT}>
            Select how many bedrooms and bathrooms you&apos;d like us to care
            for.
          </p>
        </fieldset>

        <fieldset className={QUOTE_CARD} aria-labelledby="ppc-quote-step-2">
          <legend className="sr-only">Home size</legend>
          <QuoteStepHeader step={2} id="ppc-quote-step-2">
            Home Size
          </QuoteStepHeader>
          <div className="mt-6">
            <NumberField
              id={quoteFieldId("ppc-total-sqft")}
              label="Total Sq Ft"
              value={sqft}
              setValue={(value: number) => {
                markStarted();
                setSqft(value);
                setConfirmLowSqft(false);
              }}
              min={0}
              step={50}
              describedBy={showSqftGuardrail ? `${sqftHintId} ${sqftRangeHintId}` : sqftHintId}
            />
            <p id={sqftHintId} className={QUOTE_HINT}>
              Enter the approximate total square footage we'll be cleaning. Your home's actual size and condition will be confirmed during your walkthrough before your final price is set.
            </p>
            {showSqftGuardrail && (
              <div
                id={sqftRangeHintId}
                className="mt-2 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-stone-700"
              >
                <p className="font-medium text-stone-900">Just checking your home size</p>
                <p className="mt-1 leading-relaxed">
                  {result.sqftInput.toLocaleString()} sq ft is smaller than typical
                  for a {result.bedrooms}-bedroom home. Is{" "}
                  {result.sqftInput.toLocaleString()} sq ft the approximate total
                  area we&apos;ll be cleaning?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmLowSqft(true)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-stone-50 ${confirmLowSqft ? "border-green-400 bg-green-50 text-green-800" : "border-stone-300 bg-white text-stone-900"}`}
                  >
                    Yes, that&apos;s correct{confirmLowSqft && <span className="ml-1 text-green-600">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmLowSqft(false);
                      document.getElementById(quoteFieldId("ppc-total-sqft"))?.focus();
                    }}
                    className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-stone-50"
                  >
                    Let me update it
                  </button>
                </div>
                {result.sqftGuardrailActive && (
                  <p className="mt-2 text-xs text-stone-600">
                    Until confirmed, this estimate uses {result.sqftGuardrailMin.toLocaleString()} sq ft.
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className={QUOTE_CARD} aria-labelledby="ppc-quote-step-3">
          <legend className="sr-only">Optional add-ons</legend>
          <QuoteStepHeader step={3} id="ppc-quote-step-3">
            Add-Ons (Optional)
          </QuoteStepHeader>
          <div className="mt-6 space-y-3 text-sm text-stone-700">
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
              <input
                id={quoteFieldId("ppc-addon-fridge")}
                type="checkbox"
                checked={includeFridge}
                onChange={(e) => {
                  markStarted();
                  setIncludeFridge(e.target.checked);
                }}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor={quoteFieldId("ppc-addon-fridge")}>
                <span className="font-medium text-stone-900">Inside fridge</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_FRIDGE_PRICE}, adds approximately 30 to 75 minutes)
                </span>
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
              <input
                id={quoteFieldId("ppc-addon-oven")}
                type="checkbox"
                checked={includeOven}
                onChange={(e) => {
                  markStarted();
                  setIncludeOven(e.target.checked);
                }}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor={quoteFieldId("ppc-addon-oven")}>
                <span className="font-medium text-stone-900">Inside oven</span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_OVEN_PRICE}, adds approximately 30 to 75 minutes)
                </span>
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50/40 px-4 py-3">
              <input
                id={quoteFieldId("ppc-addon-second-kitchen")}
                type="checkbox"
                checked={includeSecondKitchen}
                onChange={(e) => {
                  markStarted();
                  setIncludeSecondKitchen(e.target.checked);
                }}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-400"
              />
              <label htmlFor={quoteFieldId("ppc-addon-second-kitchen")}>
                <span className="font-medium text-stone-900">
                  Second full kitchen
                </span>{" "}
                <span className="text-stone-500">
                  (+${ADDON_SECOND_KITCHEN_FEE_LOW}–$
                  {ADDON_SECOND_KITCHEN_FEE_HIGH}+, adds approximately 60 to 90
                  minutes)
                </span>
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div
        id="quote-results"
        className="mt-8 scroll-mt-[var(--header-height,120px)]"
      >
        <section className={`${QUOTE_CARD} bg-[#fffbea]`}>
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-5 md:gap-8">
            <div className="md:col-span-3">
              <h3 className={QUOTE_SECTION_LABEL}>Your estimated deep clean</h3>
              <div className="mt-3 flex items-center justify-between gap-3 md:block">
                <p className="whitespace-nowrap text-3xl font-semibold tabular-nums md:text-4xl">
                  {result.totalAfterPromoLow === result.totalAfterPromoHigh
                    ? formatCurrency(result.totalAfterPromoHigh)
                    : `${formatCurrency(result.totalAfterPromoLow)}–${formatCurrency(
                      result.totalAfterPromoHigh
                    )}`}
                </p>
                <button
                  type="button"
                  className="inline-flex w-auto max-w-[50%] shrink-0 items-center rounded-full border border-[#a7eff1]/80 bg-white/70 px-3 py-1 text-[11px] font-semibold !normal-case !tracking-normal text-stone-800 md:hidden"
                  style={{ textTransform: "none", letterSpacing: "normal" }}
                  onClick={() => setShowMobileValueDetails((current) => !current)}
                  aria-expanded={showMobileValueDetails}
                >
                  Found a lower quote elsewhere?
                  <span className="ml-1 text-xs" aria-hidden>
                    {showMobileValueDetails ? "\u2212" : "+"}
                  </span>
                </button>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                {result.bedrooms} {result.bedrooms === 1 ? "bedroom" : "bedrooms"}
                {" · "}
                {result.bathrooms}{" "}
                {result.bathrooms === 1 ? "bathroom" : "bathrooms"}
                {" · "}
                {(result.sqftGuardrailActive
                  ? result.sqftGuardrailMin
                  : result.sqftInput > 0
                    ? result.sqftInput
                    : result.estSqft
                ).toLocaleString()} sq ft
                {(result.sqftInput <= 0 || result.sqftGuardrailActive) && <span className="text-stone-400"> (est.)</span>}
              </p>
              <div className="md:hidden">
                {showMobileValueDetails && (
                  <div className="mt-2 space-y-2 rounded-xl border border-[#a7eff1]/70 bg-[#a7eff1]/35 px-4 py-3 text-sm leading-relaxed text-stone-600">
                    <p>
                      Not all cleaning quotes include the same scope. Lower prices
                      may reflect a more limited service or separately priced
                      add-ons.
                    </p>
                    <p>
                      Our deep clean includes a comprehensive scope backed by our{" "}
                      <Link
                        href="/satisfaction-guarantee"
                        className="font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                      >
                        Satisfaction Guarantee
                      </Link>
                      .
                    </p>
                    <Link
                      href="#whats-included"
                      className="inline-block font-medium text-stone-800 underline underline-offset-2 hover:text-stone-950"
                    >
                      Compare what&apos;s included &rarr;
                    </Link>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Your final price is confirmed during your walkthrough based on
                your home&apos;s size and condition.
              </p>
            </div>

            <aside className="hidden rounded-xl border border-[#a7eff1]/70 bg-[#a7eff1]/35 px-4 py-3 md:col-span-2 md:block">
              <p className="text-sm font-semibold text-stone-900">
                Found a lower quote elsewhere?
              </p>
              <p className="mt-1.5 text-sm leading-snug text-stone-600 sm:mt-2 sm:leading-relaxed">
                Not all cleaning quotes include the same scope. Lower prices may
                reflect a more limited service or separately priced add-ons.
              </p>
              <p className="mt-1.5 text-sm leading-snug text-stone-600 sm:mt-2 sm:leading-relaxed">
                Ours includes a detailed,{" "}
                <Link
                  href="#whats-included"
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

          <DeepCleanConditionRange
            low={result.totalAfterPromoLow}
            high={result.totalAfterPromoHigh}
          />

          {!result.isLargeJob && (
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-800">
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
              </p>
              <p className="mt-1 text-xs text-stone-600">
                When you schedule, you&apos;ll choose a{" "}
                <span className="font-medium">
                  {WALKTHROUGH_ARRIVAL_HOURS}-hour arrival window.
                </span>{" "}
                Once we arrive, we&apos;ll do a quick walkthrough, confirm your
                final price, and begin cleaning right away.
              </p>
            </div>
          )}

          {result.isLargeJob && (
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
              This is a larger project. For accurate scheduling, please call us
              to book so we can plan enough time and team support.
            </div>
          )}
        </section>
      </div>

      <section
        id="ppc-booking"
        className="mt-8 scroll-mt-[var(--header-height,120px)]"
      >
        <div className="rounded-2xl border border-[#a7eff1]/70 bg-white p-6 shadow-sm md:p-8">
          <h3 className={`text-xl font-semibold text-stone-900 ${HEADING_UPPER}`}>
            Ready to book your deep clean?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
            Choose an available appointment time — the scheduler opens in a new
            window. Your exact price will be confirmed during the walkthrough
            before cleaning begins.
          </p>

          {result.isLargeJob ? (
            <a
              href={`tel:${CONTACT.phone}`}
              className={`${GOLD_BTN} mt-6`}
              onClick={() => onQuoteCompleted?.(result)}
            >
              Call Us to Book
            </a>
          ) : (
            <a
              id="ppc-open-calendly"
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${GOLD_BTN} mt-6`}
              onClick={openCalendly}
            >
              Choose My Cleaning Time
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
