"use client";

import Link from "next/link";
import { trackInstantQuoteClick } from "@/helpers/instantQuoteAnalytics";
import { scrollToId } from "@/helpers/scrollToId";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

const SERVICES = [
  {
    emoji: "🏡",
    title: "Standard Cleaning",
    desc: "Weekly or bi-weekly upkeep for homes that already feel pretty tidy.",
    href: "/residential/services/standard",
  },
  {
    emoji: "✨",
    title: "Deep Cleaning",
    desc: "A full-home reset when dust, grime, or life has built up.",
    href: "/residential/services/deep",
  },
  {
    emoji: "📦",
    title: "Move In / Move Out",
    desc: "Detailed cleaning for empty homes before keys change hands.",
    href: "/residential/services/move-out",
  },
  {
    emoji: "🏢",
    title: "Commercial",
    desc: "Reliable cleaning for offices, studios, and boutique businesses.",
    href: "/commercial",
  },
];

export default function ServicesPreviewSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-preview-heading"
      className="border-t border-amber-200/60 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="services-preview-heading"
          className={`text-center text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
        >
          Our Services
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          From recurring home care to move-out details and commercial spaces—every
          service is designed with the same attention to quality.
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {SERVICES.map(({ emoji, title, desc, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-3xl border border-stone-200 bg-amber-50 p-8 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="text-3xl" aria-hidden>
                  {emoji}
                </span>
                <h3 className={`mt-4 text-xl font-semibold text-stone-900 ${HEADING_UPPER}`}>
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
                  Learn more
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => {
              trackInstantQuoteClick({
                buttonLocation: "landing_trust_section",
                buttonLabel: "Get an Instant Quote & Book Online",
                destination: "#quote",
              });
              scrollToId("#quote", 8, { focus: true });
            }}
            className={`${BTN_UPPER} inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
          >
            Get an Instant Quote & Book Online
          </button>
        </div>
      </div>
    </section>
  );
}
