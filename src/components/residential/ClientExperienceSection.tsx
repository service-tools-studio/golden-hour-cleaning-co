"use client";

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { scrollToId } from "../../helpers/scrollToId";
import {
  BTN_PRIMARY,
  HEADING_UPPER,
  QUOTE_SECTION_LABEL,
  SECTION_PAD,
} from "../../helpers/typography.js";

const POINTS = [
  {
    title: "Detailed Cleaning Checklists",
    desc: "We follow detailed cleaning checklists so important areas aren't overlooked.",
  },
  {
    title: "Thoughtful Communication",
    desc: "Clear communication before, during, and after your appointment.",
  },
  {
    title: "Consistent Cleaners",
    desc: "We do our best to send the same cleaner whenever possible, so your home is cared for by someone who knows it.",
  },
  {
    title: "Happiness Guarantee",
    desc: "If something isn't right, let us know within 24 hours and we'll return to make it right at no additional charge.",
  },
] as const;

export default function ClientExperienceSection() {
  return (
    <section className="relative w-screen max-w-[100vw] overflow-hidden bg-white [margin-left:calc(50%-50vw)] [margin-right:calc(50%-50vw)]">
      <div className="lg:relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-amber-50 lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-1/2">
          <Image
            src="/assets/golden-hour-sweep-2.jpg"
            alt="A Golden Hour cleaner smiling while holding a dust mop in a sunlit room"
            fill
            className="object-cover object-center"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div
          className={`relative px-5 md:px-10 lg:w-1/2 lg:px-10 xl:px-16 ${SECTION_PAD}`}
        >
          <div className="mx-auto max-w-xl text-center lg:mx-0">
            <p className={`mb-4 text-amber-700 ${QUOTE_SECTION_LABEL}`}>
              The Golden Hour Difference
            </p>

            <h2
              className={`text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
            >
              A Cleaning Experience Built Around You
            </h2>

            <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg">
              Your home isn&apos;t just another appointment on our schedule. We know
              inviting someone into your home requires trust, and we work hard to
              earn it every visit.
            </p>

            <ul className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              {POINTS.map(({ title, desc }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50/60 px-5 py-5 shadow-sm"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-800">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-900">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => scrollToId("#services", 8)}
              className={`${BTN_PRIMARY} mt-10`}
            >
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
