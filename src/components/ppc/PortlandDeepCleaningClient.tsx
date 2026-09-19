"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Home, Phone, ShieldCheck, Stars } from "lucide-react";
import CleaningLeadForm from "@/components/residential/CleaningLeadForm";
import PpcLandingFooter from "@/components/ppc/PpcLandingFooter";
import GoogleReviews from "@/components/residential/GoogleReviews";
import { ServicePricingCards } from "@/components/residential/ResidentialPricingGuide";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { CONTACT } from "@/constants.js";
import { SEE_PRICING_BOOK_LABEL } from "@/helpers/ctaLabels.js";
import { Badge } from "@/helpers/ui-elements.jsx";
import { scrollToId } from "@/helpers/scrollToId";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  HEADING_UPPER,
} from "@/helpers/typography.js";
import { FaqItem, Section } from "@/components/residential/servicePageParts";
import { BEFORE_AFTER_PHOTOS, beforeAfterSrc } from "@/data/beforeAfterPhotos";
import {
  FAQ_ANSWERS,
  HOURLY_CHARGE_FAQ,
  siteFaq,
} from "@/data/siteFaqs";
import { capturePpcAttribution } from "@/helpers/ppcAttribution";
import {
  PPC_DEEP_CLEAN_EVENTS,
  trackPpcDeepCleanEvent,
} from "@/helpers/ppcDeepCleanAnalytics";
import { useGooglePlaceSummary } from "@/helpers/useGooglePlaceSummary";

const FAQS = [
  HOURLY_CHARGE_FAQ,
  siteFaq("deepPricing", "How much does deep cleaning cost in Portland?"),
  siteFaq("finalPriceConfirmed", "When is my final price confirmed?"),
  siteFaq("reserveBeforeEstimate", "Can I reserve a cleaning before I get my estimate?"),
  siteFaq("deepIncluded", "What is included in a deep clean?"),
  siteFaq("supplies", "Do you bring supplies?"),
];

export default function PortlandDeepCleaningClient({
  initialRating = null,
  initialReviewCount = null,
}: {
  initialRating?: number | null;
  initialReviewCount?: number | null;
}) {
  const viewedRef = useRef(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const { rating, reviewCount } = useGooglePlaceSummary({
    rating: initialRating,
    reviewCount: initialReviewCount,
  });

  useEffect(() => {
    const attrs = capturePpcAttribution();
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackPpcDeepCleanEvent(PPC_DEEP_CLEAN_EVENTS.landingView, undefined, attrs);
  }, []);

  function scrollToPricing() {
    scrollToId("#quote", 8, { focus: true });
  }

  function scrollToRequestQuote() {
    scrollToId("#request-quote", 8, { focus: true });
  }

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <ServicesPageHeader showNav={false} logoScrollsToTop />

      <main>
        <section
          id="hero"
          className="relative overflow-hidden border-b border-amber-200 bg-amber-50"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16 lg:max-w-7xl lg:gap-12 lg:py-20">
            <div>
              <h1
                className={`text-center text-2xl leading-tight text-stone-900 md:text-left md:text-3xl lg:text-[2.15rem] ${HEADING_UPPER}`}
              >
                Home Deep Cleaning Services in Portland
              </h1>
              <p className="mt-4 text-center text-sm leading-relaxed text-stone-700 md:text-left md:text-base">
                A comprehensive, detail-focused clean designed to refresh your
                home from top to bottom.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-start">
                <a
                  href={`tel:${CONTACT.phone}`}
                  className={`${BTN_PRIMARY} w-full gap-2 sm:w-auto`}
                  aria-label="Call us at (503) 893-4795"
                  data-call-source="ppc_deep_clean_hero_call"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  Call (503) 893-4795
                </a>
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className={`${BTN_SECONDARY} w-full sm:w-auto`}
                >
                  {SEE_PRICING_BOOK_LABEL}
                </button>
              </div>
              <p className="mt-3 text-center text-sm text-stone-600 md:text-left">
                Prefer to book online?{" "}
                <Link
                  href="/book-online"
                  className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
                >
                  Reserve your deep clean →
                </Link>
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-stone-700">
                <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
                <Badge icon={<Award />} label="Satisfaction Guarantee" />
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
                          {reviewCount}{" "}
                          {reviewCount === 1 ? "review" : "reviews"}
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
                src="/assets/vacuuming.PNG"
                alt="A Golden Hour cleaner smiling while vacuuming a living room rug"
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        <GoogleReviews />

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
              {BEFORE_AFTER_PHOTOS.slice(0, 4).map(({ id, title, alt }) => (
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
          tabIndex={-1}
          className="scroll-mt-[var(--header-height,100px)] bg-amber-50 px-4 pb-12 pt-10 outline-none md:pb-16 md:pt-12"
        >
          <div className="mx-auto max-w-5xl">
            <header className="mx-auto max-w-2xl text-center">
              <h2
                className={`text-2xl leading-tight text-stone-900 md:text-3xl ${HEADING_UPPER}`}
              >
                Deep Cleaning Pricing
              </h2>
              <p className="mt-3 text-base leading-relaxed text-stone-600 md:text-lg">
                Starting rates by home size. Need a tailored number? Request a
                personalized quote below — then reserve when you&apos;re ready.
              </p>
            </header>

            <ServicePricingCards
              serviceSlug="deep"
              className="mt-10"
              learnMoreLabel="See full checklist"
            />

            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={scrollToRequestQuote}
                className={`${BTN_PRIMARY} w-full sm:w-auto`}
              >
                Request a Personalized Quote
              </button>
              <p className="text-center text-sm text-stone-600">
                Or call{" "}
                <a
                  href={`tel:${CONTACT.phone}`}
                  data-call-source="ppc_deep_clean_pricing_call"
                  className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
                >
                  (503) 893-4795
                </a>
                {" · "}
                <Link
                  href="/book-online"
                  className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
                >
                  Reserve your deep clean →
                </Link>
              </p>
            </div>
          </div>

          <div
            id="request-quote"
            tabIndex={-1}
            className="mx-auto mt-14 max-w-3xl scroll-mt-[var(--header-height,100px)] outline-none"
          >
            {!quoteSubmitted ? (
              <header className="text-center">
                <h2
                  className={`text-2xl leading-tight text-stone-900 md:text-3xl ${HEADING_UPPER}`}
                >
                  Request a personalized quote
                </h2>
                <p className="mt-3 text-base leading-relaxed text-stone-600 md:text-lg">
                  Share a few details about your Portland home and we&apos;ll
                  help you find the right deep clean and price. After you
                  submit, you can reserve an available cleaning time online.
                </p>
              </header>
            ) : null}

            <div className={quoteSubmitted ? undefined : "mt-10"}>
              <CleaningLeadForm
                mode="quote"
                initialCleaningType="Deep Cleaning"
                onSuccess={() => setQuoteSubmitted(true)}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <Section title="FAQ">
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              {FAQS.map((faq) => (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={
                    faq.question ===
                    "How much does deep cleaning cost in Portland?" ? (
                      <>
                        You can review{" "}
                        <a
                          href="#pricing-deep"
                          className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToId("#pricing-deep", 8, { focus: true });
                          }}
                        >
                          starting prices
                        </a>{" "}
                        by home size on this page, then request a personalized
                        quote based on number of bedrooms, bathrooms, square
                        footage, and any add-ons. For a typical Portland home,
                        we&apos;ll send you a broad range quote rather than a
                        single number because condition affects the work
                        required. We confirm your final price after an in-person
                        walkthrough, right before cleaning begins.
                      </>
                    ) : faq.question === "What is included in a deep clean?" ? (
                      <>
                        {FAQ_ANSWERS.deepIncluded.replace(
                          /\s*See the full checklist above\.$/,
                          "",
                        )}{" "}
                        <Link
                          href="/deep-clean/whats-included"
                          className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
                        >
                          See the full checklist →
                        </Link>
                      </>
                    ) : (
                      faq.answer
                    )
                  }
                />
              ))}
            </div>
          </Section>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`tel:${CONTACT.phone}`}
              className={`${BTN_PRIMARY} w-full gap-2 sm:w-auto`}
              aria-label="Call us at (503) 893-4795"
              data-call-source="ppc_deep_clean_faq_call"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              Call (503) 893-4795
            </a>
            <button
              type="button"
              onClick={scrollToPricing}
              className={`${BTN_SECONDARY} w-full sm:w-auto`}
            >
              {SEE_PRICING_BOOK_LABEL}
            </button>
          </div>
          <p className="mt-3 text-center text-sm text-stone-600">
            Ready to schedule?{" "}
            <Link
              href="/book-online"
              className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
            >
              Reserve your deep clean →
            </Link>
          </p>
        </section>

        <PpcLandingFooter />
      </main>
    </div>
  );
}
