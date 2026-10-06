"use client";

import { BadgeCheck, Award, ShieldCheck, Stars } from "lucide-react";
import { scrollToId } from "../../helpers/scrollToId";
import { useGooglePlaceSummary } from "../../helpers/useGooglePlaceSummary";
import {
  BTN_UPPER,
  HEADING_UPPER,
  SECTION_EYEBROW,
} from "../../helpers/typography.js";
import { Badge } from "../../helpers/ui-elements.jsx";
import Image from "next/image";
import Link from "next/link";

/** Side-by-side hero CTAs — tighter padding on phones so both labels fit. */
const HERO_BTN_BASE = `${BTN_UPPER} inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border px-2.5 py-2.5 text-center text-xs font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.98] sm:min-h-0 sm:px-5 sm:text-sm`;
const HERO_BTN_PRICING = `${HERO_BTN_BASE} border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50`;
const HERO_BTN_RESERVE = `${HERO_BTN_BASE} border-[#DCCF6E] bg-[#F0E79A] text-stone-900 shadow-sm hover:bg-[#E6DB82]`;

export default function Hero() {
  const { rating } = useGooglePlaceSummary();
  const googleRatingLabel = `★★★★★ ${(rating ?? 5).toFixed(1)} Google Rating`;

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
    >
      <div className="lg:relative">
        <div className="relative aspect-[15/8] w-full overflow-hidden bg-amber-50 sm:aspect-[5/3] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-1/2">
          <Image
            src="/assets/golden-hour-homepage.png"
            alt="A Golden Hour cleaner smiling while wiping a gold-framed bathroom mirror"
            fill
            className="object-cover object-[center_32%] lg:object-[center_20%]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className="relative flex items-center px-4 pt-4 pb-14 lg:ml-[50%] lg:w-1/2 lg:px-10 lg:py-14 xl:px-16 xl:py-16">
          <div className="mx-auto w-full max-w-6xl text-center lg:max-w-lg xl:max-w-xl">
            <p className={`${SECTION_EYEBROW} text-center`}>
              📍 Portland-Metro Area
            </p>
            <h1
              className={`mt-3 text-center text-xl leading-snug sm:text-2xl lg:text-[1.65rem] lg:leading-snug lg:text-stone-900 xl:text-3xl ${HEADING_UPPER}`}
            >
              Professional house cleaning in Portland, Oregon — high standards,
              intentional care & consistent results.
            </h1>

            <p className="mt-4 text-center text-sm leading-relaxed text-stone-700 sm:text-base lg:mt-5">
              Meticulous, non-toxic cleaning with thoughtful service, transparent
              pricing, and easy online booking.
            </p>

            <div className="mt-5 flex gap-3 lg:mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#quote", 8);
                }}
                className={HERO_BTN_PRICING}
              >
                See Pricing
              </button>
              <Link
                href="/book-online"
                className={HERO_BTN_RESERVE}
              >
                Reserve Your Cleaning
              </Link>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#services", 8);
                }}
                className="text-sm text-stone-600 underline underline-offset-4 hover:text-stone-900"
              >
                Learn about our services →
              </button>
            </div>

            <div className="mt-8 grid w-full grid-cols-2 gap-2.5 text-sm text-stone-700 sm:grid-cols-4 sm:gap-3 lg:mt-12 lg:grid-cols-2">
              <Badge icon={<ShieldCheck />} label="Vetted Professionals" />
              <Badge icon={<BadgeCheck />} label="Women Owned and Local" />
              <Badge icon={<Award />} label="Satisfaction Guarantee" />
              <Badge
                icon={<Stars />}
                label={googleRatingLabel}
                onClick={() => scrollToId("#reviews", 8)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
