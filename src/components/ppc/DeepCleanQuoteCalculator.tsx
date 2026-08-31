"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Info } from "lucide-react";
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
import ContactSheet from "@/components/residential/ContactSheet.jsx";
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
import { trackQuoteViewed } from "@/helpers/quoteViewAnalytics";
import { useQuoteResultsInView } from "@/helpers/useQuoteResultsInView";
import {
  PPC_DEEP_CLEAN_EVENTS,
  trackPpcDeepCleanEvent,
} from "@/helpers/ppcDeepCleanAnalytics";

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

  const roomsHintId = "ppc-quote-rooms-hint";
  const sqftHintId = "ppc-quote-sqft-hint";

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
      }),
    [bedrooms, bathrooms, sqft, includeFridge, includeOven, includeSecondKitchen]
  );

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

  const quoteResultsRef = useQuoteResultsInView(() => {
    const quoteLow = result.totalAfterPromoLow;
    const quoteHigh = result.totalAfterPromoHigh;
    trackQuoteViewed({
      quoteLow,
      quoteHigh,
      cleanType: "deep",
      attribution,
    });
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.quoteViewed,
      { quote_low: quoteLow, quote_high: quoteHigh },
      attribution
    );
  });

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
      { ...getPpcAttribution(), ...attribution }
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
              }}
              min={0}
              step={50}
              describedBy={sqftHintId}
            />
            <p id={sqftHintId} className="mt-4 text-sm leading-snug text-stone-500">
              Please enter your home&apos;s square footage as accurately as possible so we can provide a reliable quote and plan appropriate staffing. Your home&apos;s size and condition will be confirmed during the initial walkthrough, and your online quote is subject to change based on that assessment.
            </p>
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
        ref={quoteResultsRef}
        id="quote-results"
        className="mt-8 scroll-mt-[var(--header-height,120px)]"
      >
        <section className={`${QUOTE_CARD} relative bg-[#fffbea]`}>
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
                <h3 className={QUOTE_SECTION_LABEL}>
                  Your estimated
                  <br className="md:hidden" />
                  <span className="hidden md:inline"> </span>deep clean
                </h3>
                <p className="mt-3 whitespace-nowrap text-3xl font-semibold tabular-nums md:text-4xl">
                  {result.totalAfterPromoLow === result.totalAfterPromoHigh
                    ? formatCurrency(result.totalAfterPromoHigh)
                    : `${formatCurrency(result.totalAfterPromoLow)}–${formatCurrency(
                      result.totalAfterPromoHigh
                    )}`}
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
              <p className="mt-6 hidden text-sm leading-snug text-stone-600 md:block">
                This online quote is based on the information provided and is
                subject to change. We&apos;ll assess your home&apos;s{" "}
                <strong className="font-bold">actual size and condition</strong>{" "}
                during the initial walkthrough and confirm
                your final price before cleaning begins.
              </p>
            </div>

            <aside className="hidden rounded-xl border border-[#a7eff1]/70 bg-[#a7eff1]/35 px-4 py-3 md:col-span-2 md:block">
              <p className="text-sm font-semibold text-stone-900">
                Comparing another quote?
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

          <p className="mt-6 text-sm leading-snug text-stone-600 md:hidden">
            This online quote is based on the information provided and is
            subject to change. We&apos;ll assess your home&apos;s{" "}
            <strong className="font-bold">actual size and condition</strong>{" "}
            during the initial walkthrough and confirm
            your final price before cleaning begins.
          </p>

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
        className="mt-8 scroll-mt-[var(--header-height,120px)] space-y-4"
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
              data-call-source="ppc_call_us_to_book"
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
              data-calendly-source="ppc_deep_clean"
              data-calendly-skip-auto="true"
              className={`${GOLD_BTN} mt-6`}
              onClick={openCalendly}
            >
              Choose My Cleaning Time
            </a>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className={`text-xl font-semibold text-stone-900 ${HEADING_UPPER}`}>
            Questions?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
            Prefer to talk it through? Reach us by phone, text, or email — we
            can help with your quote or booking.
          </p>
          <div className="mt-6">
            <ContactSheet
              phone={CONTACT.phone}
              sms={CONTACT.sms}
              email={CONTACT.email}
              buttonLabel="Call / Text / Email"
              buttonClassName={`${BTN_UPPER} inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300`}
              context={{
                level: "deep" as const,
                sqftLow: result.sqftLow,
                sqftHigh: result.sqftHigh,
                sqftInput: result.sqftInput,
                bedrooms,
                bathrooms,
                total: result.totalAfterPromoHigh,
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
                promo: null,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
