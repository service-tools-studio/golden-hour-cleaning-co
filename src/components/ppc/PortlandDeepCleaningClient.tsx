"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BadgeCheck,
  CalendarDays,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Stars,
} from "lucide-react";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import DeepCleanChecklist from "@/components/residential/DeepCleanChecklist";
import { Badge } from "@/helpers/ui-elements.jsx";
import { scrollToId } from "@/helpers/scrollToId";
import { CONTACT } from "@/constants.js";
import {
  BTN_UPPER,
  HEADING_UPPER,
} from "@/helpers/typography.js";
import {
  BulletList,
  FaqItem,
  HOURLY_CHARGE_FAQ,
  PORTLAND_METRO_AREAS,
  Section,
} from "@/components/residential/servicePageParts";
import { BEFORE_AFTER_PHOTOS, beforeAfterSrc } from "@/data/beforeAfterPhotos";
import { capturePpcAttribution, type PpcAttribution } from "@/helpers/ppcAttribution";
import {
  PPC_DEEP_CLEAN_EVENTS,
  trackPpcDeepCleanEvent,
} from "@/helpers/ppcDeepCleanAnalytics";
import { trackCalendlyClick } from "@/helpers/calendlyAnalytics";
import { calculateQuote } from "@/lib/quotePricing";
import { useGooglePlaceSummary } from "@/helpers/useGooglePlaceSummary";

const DeepCleanQuoteCalculator = dynamic(
  () => import("@/components/ppc/DeepCleanQuoteCalculator"),
  { ssr: false }
);

const GOLD_BTN = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`;
const SECONDARY_BTN = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`;

const TRUST_VALUES = [
  {
    icon: Home,
    title: "A True Top-to-Bottom Reset",
    desc: "Detailed care throughout your home, with extra attention to buildup and areas that need a more intensive clean.",
  },
  {
    icon: BadgeCheck,
    title: "Your Price Before We Begin",
    desc: "See your estimated range online. We'll confirm your final price during a quick walkthrough before cleaning starts.",
  },
  {
    icon: CalendarDays,
    title: "Book Entirely Online",
    desc: "See your estimate, choose an available time, and reserve your cleaning without waiting for calls or quotes.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Get your instant quote",
    desc: "Tell us about your Portland home and see your personalized deep-clean range in about 30 seconds.",
  },
  {
    step: "02",
    title: "Choose a cleaning time",
    desc: "Book a time that works for you. We'll confirm your final price during the walkthrough before we begin.",
  },
  {
    step: "03",
    title: "Enjoy a deeper reset",
    desc: "Our team arrives ready to restore kitchens, bathrooms, floors, and the details that routine cleaning misses.",
  },
];

const FAQS = [
  HOURLY_CHARGE_FAQ,
  {
    question: "How much does deep cleaning cost in Portland?",
    answer:
      "Your instant quote is based on your home's size, bathrooms, and any add-ons you select. For a typical Portland home, you'll see a range rather than a single number because condition affects the work required. We confirm your final price after a walkthrough, before cleaning begins.",
  },
  {
    question: "Why is my quote shown as a range?",
    answer:
      "Homes of the same size can need very different levels of cleaning depending on buildup. The range covers light, moderate, and heavy buildup using the same Golden Hour deep-clean pricing. You don't choose a condition level yourself.",
  },
  {
    question: "When is my final price confirmed?",
    answer:
      "We assess the home during your walkthrough and confirm the final price before cleaning begins. You'll know the exact amount before we start.",
  },
  {
    question: "Do you bring supplies?",
    answer:
      "Yes. We use eco-friendly products whenever possible. For heavy buildup, stronger conventional products may be used when needed. Our team arrives with professional-grade products and equipment. If you have product preferences, let us know.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "Not necessarily. Many clients provide secure access while they're away. We'll coordinate access details with you before your appointment.",
  },
  {
    question: "Are your cleaners background-checked?",
    answer:
      "Yes. Golden Hour cleaners are background-checked, and the company is licensed and insured in Oregon.",
  },
  {
    question: "What is included in a deep clean?",
    answer:
      "A deep clean includes kitchens, bathrooms, bedrooms, living areas, and detailed work throughout the home — baseboards, window sills, light switches, reachable trim, edges, and more. See the full checklist above.",
  },
  {
    question: "Can I start recurring cleaning afterward?",
    answer:
      "Yes. Many clients begin with a deep clean, then move to recurring standard cleaning. We can help you plan that after your first visit.",
  },
];

type FunnelPhase = "quote" | "book" | "done";

export default function PortlandDeepCleaningClient({
  initialRating = null,
  initialReviewCount = null,
}: {
  initialRating?: number | null;
  initialReviewCount?: number | null;
}) {
  const [attribution, setAttribution] = useState<PpcAttribution>({});
  const [phase, setPhase] = useState<FunnelPhase>("quote");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const viewedRef = useRef(false);
  const calendlyOpenedRef = useRef(false);
  const [quoteInView, setQuoteInView] = useState(false);
  const updateQuoteVisibilityRef = useRef(() => {});
  const { rating, reviewCount } = useGooglePlaceSummary({
    rating: initialRating,
    reviewCount: initialReviewCount,
  });

  useEffect(() => {
    const attrs = capturePpcAttribution();
    setAttribution(attrs);
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackPpcDeepCleanEvent(PPC_DEEP_CLEAN_EVENTS.landingView, undefined, attrs);
  }, []);

  useEffect(() => {
    const updateQuoteVisibility = () => {
      const section = document.getElementById("quote");
      if (!section) {
        setQuoteInView(false);
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const headerOffset = 88;
      setQuoteInView(rect.top < viewportHeight && rect.bottom > headerOffset);
    };

    updateQuoteVisibilityRef.current = updateQuoteVisibility;
    updateQuoteVisibility();
    window.addEventListener("scroll", updateQuoteVisibility, { passive: true });
    window.addEventListener("resize", updateQuoteVisibility);
    document.addEventListener("scroll", updateQuoteVisibility, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", updateQuoteVisibility);
      window.removeEventListener("resize", updateQuoteVisibility);
      document.removeEventListener("scroll", updateQuoteVisibility, true);
    };
  }, []);

  function handleQuoteStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.quoteStarted,
      undefined,
      attribution
    );
  }

  function handleQuoteCompleted(result: ReturnType<typeof calculateQuote>) {
    if (completedRef.current) return;
    completedRef.current = true;
    const quoteLow = result.totalAfterPromoLow;
    const quoteHigh = result.totalAfterPromoHigh;
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.quoteCompleted,
      { quote_low: quoteLow, quote_high: quoteHigh },
      attribution
    );
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.quoteLow,
      { value: quoteLow },
      attribution
    );
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.quoteHigh,
      { value: quoteHigh },
      attribution
    );
    setPhase((current) => (current === "done" ? current : "book"));
  }

  function handleCalendlyOpened() {
    setPhase((current) => (current === "done" ? current : "book"));
    if (calendlyOpenedRef.current) return;
    calendlyOpenedRef.current = true;
    trackCalendlyClick({
      source: "ppc_deep_clean",
      url: calendlyUrl || undefined,
      cleanType: "deep",
      attribution,
    });
    trackPpcDeepCleanEvent(
      PPC_DEEP_CLEAN_EVENTS.calendlyClick,
      undefined,
      attribution
    );
  }

  function scrollToQuote() {
    scrollToId("#quote", 8, { focus: true });
    window.setTimeout(() => updateQuoteVisibilityRef.current(), 200);
    window.setTimeout(() => updateQuoteVisibilityRef.current(), 700);
  }

  return (
    <div className={`min-h-screen bg-amber-50 text-stone-900 ${phase !== "done" ? "pb-20 md:pb-0" : ""}`}>
      <header className="sticky top-0 z-[100001] w-full border-b border-amber-200 bg-[#a7eff1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="/" aria-label="Go to homepage">
            <Image
              src="/assets/Golden Hour - commercial.png"
              alt="Golden Hour Cleaning Co."
              width={200}
              height={100}
              priority
              className="h-16 w-auto sm:h-20"
              sizes="(max-width: 640px) 160px, 200px"
            />
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToQuote}
              className={`${GOLD_BTN} max-md:hidden w-auto px-4 py-2 text-xs sm:text-sm`}
            >
              Instant Quote + Book
            </button>
            <a
              href={`tel:${CONTACT.phone}`}
              className={`${SECONDARY_BTN} w-auto gap-1.5 px-4 py-2 text-xs sm:text-sm`}
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Call Us
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="relative overflow-hidden border-b border-amber-200 bg-amber-50"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
            <div>
              <h1
                className={`text-center text-3xl leading-tight text-stone-900 md:text-left md:text-4xl ${HEADING_UPPER}`}
              >
                Home Deep Cleaning Services in Portland
              </h1>
              <p className="mt-4 text-center text-base leading-relaxed text-stone-700 md:text-left md:text-lg">
                A comprehensive, detail-focused clean designed to refresh your
                home from top to bottom.
              </p>
              <p className="mt-3 text-center text-sm leading-relaxed text-stone-600 md:text-left md:text-base">
                Get your price and book your cleaning online in seconds—no calls
                or back-and-forth required.
              </p>
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={scrollToQuote} className={`${GOLD_BTN} w-full sm:w-auto`}>
                  Get My Instant Quote
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-700">
                <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
                <Badge icon={<BadgeCheck />} label="Background-Checked" />
                <Badge icon={<Home />} label="Women-Owned & Local" />
                <button
                  type="button"
                  onClick={() => scrollToId("#reviews", 8)}
                  className="flex min-h-16 w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-left hover:border-amber-300 hover:bg-amber-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100/80">
                    <Stars className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-[13px] font-medium leading-snug text-stone-800">
                    {reviewCount != null ? (
                      <>
                        ★★★★★ {(rating ?? 5).toFixed(1)} on Google
                        <span className="mt-0.5 block text-[12px] text-stone-600">
                          {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </>
                    ) : (
                      "★★★★★ 5.0 on Google"
                    )}
                  </span>
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
              <Image
                src="/assets/golden-hour-homepage.png"
                alt="A Golden Hour cleaner smiling while wiping a gold-framed bathroom mirror"
                fill
                priority
                className="object-cover object-[center_20%]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10" aria-label="Why Golden Hour">
          <ul className="grid gap-4 sm:grid-cols-3">
            {TRUST_VALUES.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"
              >
                <Icon className="h-5 w-5 text-stone-800" aria-hidden />
                <p className={`mt-3 text-sm font-semibold text-stone-900 ${HEADING_UPPER}`}>
                  {title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-amber-200/60 bg-white py-10"
          aria-labelledby="ppc-results-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <h2
              id="ppc-results-heading"
              className={`text-center text-xl font-semibold text-stone-900 md:text-2xl ${HEADING_UPPER}`}
            >
              See the Golden Hour Difference
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-stone-600">
              Before-and-after results from Golden Hour visits.
            </p>
            <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
              {BEFORE_AFTER_PHOTOS.slice(0, 3).map(({ id, title, alt }) => (
                <figure
                  key={id}
                  className="w-[min(80%,280px)] shrink-0 overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm sm:w-[300px]"
                >
                  <div className="relative aspect-[3/2] w-full bg-stone-100">
                    <Image
                      src={beforeAfterSrc(id)}
                      alt={alt}
                      fill
                      sizes="300px"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="border-t border-amber-100 px-3 py-2 text-sm font-medium text-stone-800">
                    {title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section
          id="quote"
          className="scroll-mt-[var(--header-height,88px)] bg-amber-50 pb-12 md:pb-16"
        >
          <div className="border-y border-amber-300 bg-amber-400 px-4 py-8 text-center md:py-10">
            <div className="mx-auto max-w-3xl">
              <p
                className={`text-xs font-semibold text-stone-600 md:text-sm ${HEADING_UPPER}`}
              >
                Your Personalized Estimate
              </p>
              <h2
                id="quote-calculator-heading"
                tabIndex={-1}
                className={`mt-3 text-2xl font-semibold text-stone-900 md:text-3xl ${HEADING_UPPER} focus:outline-none`}
              >
                Get Your Instant Deep Clean Quote
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-700 md:text-base">
                Tell us a little about your home to see your personalized pricing
                range. It only takes about 30 seconds.
              </p>
              <div
                className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-stone-700 sm:text-xs"
                aria-label="Quote steps: home details, your estimate, then book"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] text-stone-800">
                    1
                  </span>
                  Home Details
                </span>
                <span aria-hidden="true" className="text-amber-700/50">
                  →
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] text-stone-800">
                    2
                  </span>
                  Your Estimate
                </span>
                <span aria-hidden="true" className="text-amber-700/50">
                  →
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] text-stone-800">
                    3
                  </span>
                  Book
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <DeepCleanQuoteCalculator
              attribution={attribution}
              onQuoteStarted={handleQuoteStarted}
              onQuoteCompleted={handleQuoteCompleted}
              onCalendlyOpened={handleCalendlyOpened}
              onCalendlyUrlChange={setCalendlyUrl}
            />
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-6 pt-6 pb-12 md:pt-8 md:pb-16">
          <Section
            id="whats-included"
            title="What's Included in a Deep Clean"
          >
            <DeepCleanChecklist />
          </Section>

          <Section title="Why Portland Homeowners Choose Golden Hour">
            <BulletList
              items={[
                "Friendly, professional cleaners",
                "Meticulous attention to detail",
                "Reliable communication",
                "Respect for your home and belongings",
                "Consistent, high-quality results",
                "Convenient online booking",
                "Transparent pricing with no hidden fees",
                "Women owned and locally operated",
              ]}
            />
          </Section>
        </article>

        <GoogleReviews />

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className={`text-2xl font-semibold text-stone-900 md:text-3xl ${HEADING_UPPER}`}>
            How Deep Cleaning Works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PROCESS_STEPS.map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm"
              >
                <p className="text-2xl font-semibold text-[#dcbb52]">{step}</p>
                <h3 className={`mt-2 text-lg font-semibold ${HEADING_UPPER}`}>
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <h2 className={`text-2xl font-semibold text-stone-900 md:text-3xl ${HEADING_UPPER}`}>
            Portland Service Area
          </h2>
          <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-stone-700">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone-800" aria-hidden />
            Golden Hour Cleaning Co. provides deep house cleaning throughout
            Portland and nearby communities.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {PORTLAND_METRO_AREAS.map((area) => (
              <span
                key={area}
                className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <Section title="FAQ">
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              {FAQS.map((faq) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </Section>
          <div className="mt-10 text-center">
            <button type="button" onClick={scrollToQuote} className={GOLD_BTN}>
              Get My Instant Quote
            </button>
          </div>
        </section>

        <Footer />
      </main>

      {phase !== "done" && !quoteInView && (
        <div className="fixed inset-x-0 bottom-0 z-[100000] border-t border-amber-200 bg-amber-50/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm md:hidden">
          {phase === "book" && calendlyUrl ? (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-calendly-source="ppc_deep_clean"
              data-calendly-skip-auto="true"
              className={`${GOLD_BTN} w-full normal-case tracking-normal`}
              onClick={handleCalendlyOpened}
            >
              Choose My Cleaning Time
            </a>
          ) : (
            <button
              type="button"
              onClick={scrollToQuote}
              className={`${GOLD_BTN} w-full normal-case tracking-normal`}
            >
              Get My Instant Quote
            </button>
          )}
        </div>
      )}
    </div>
  );
}
