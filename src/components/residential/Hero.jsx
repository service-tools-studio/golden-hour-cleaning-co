"use client";

import { BadgeCheck, Award, ShieldCheck, Stars } from "lucide-react";
import { scrollToId } from "../../helpers/scrollToId";
import { useGooglePlaceSummary } from "../../helpers/useGooglePlaceSummary";
import {
  BTN_PRIMARY_RESPONSIVE,
  HEADING_UPPER,
} from "../../helpers/typography.js";
import { Badge } from "../../helpers/ui-elements.jsx";
import Image from "next/image";

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
            <h1
              className={`text-center text-xl leading-snug sm:text-2xl lg:text-[1.65rem] lg:leading-snug lg:text-stone-900 xl:text-3xl ${HEADING_UPPER}`}
            >
              Professional house cleaners with high standards, intentional care
              & consistent results.
            </h1>

            <p className="mt-4 text-center text-sm leading-relaxed text-stone-700 sm:text-base lg:mt-5">
              Meticulous, non-toxic cleaning for Portland-area homes. Thoughtful
              service, consistent results, transparent pricing, and easy online
              booking.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("#quote", 8);
                }}
                className={`${BTN_PRIMARY_RESPONSIVE} w-full sm:flex-1`}
              >
                See Pricing
              </button>
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
              <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
              <Badge icon={<BadgeCheck />} label="Background-Checked" />
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
