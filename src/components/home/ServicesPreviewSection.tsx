"use client";

import Link from "next/link";
import { Building2, Home, PackageOpen, Sparkles } from "lucide-react";
import { trackInstantQuoteClick } from "@/helpers/instantQuoteAnalytics";
import { scrollToId } from "@/helpers/scrollToId";
import {
  BTN_PRIMARY,
  SECTION_HEADING,
  SECTION_PAD,
} from "@/helpers/typography.js";

const SERVICES = [
  {
    icon: Home,
    title: "Standard Cleaning",
    desc: "Recurring upkeep for tidy homes — or homes professionally cleaned within the past 2–4 weeks.",
    href: "/residential/services/standard",
  },
  {
    icon: Sparkles,
    title: "Deep Cleaning",
    desc: "A full-home reset when dust, grime, or life has built up.",
    href: "/residential/services/deep",
  },
  {
    icon: PackageOpen,
    title: "Move In / Move Out",
    desc: "Detailed cleaning for empty homes before keys change hands.",
    href: "/residential/services/move-out",
  },
  {
    icon: Building2,
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
      className={`border-t border-amber-200/60 bg-white ${SECTION_PAD}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="services-preview-heading" className={SECTION_HEADING}>
          Our Services
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-stone-600">
          From recurring home care to move-out details and commercial spaces—every
          service is designed with the same attention to quality.
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {SERVICES.map(({ icon: Icon, title, desc, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-3xl border border-amber-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3
                  className={`mt-4 text-xl font-semibold uppercase tracking-wide text-stone-900`}
                >
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
                  Learn more
                  <span
                    className="transition group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              trackInstantQuoteClick({
                buttonLocation: "landing_trust_section",
                buttonLabel: "See Pricing",
                destination: "#quote",
              });
              scrollToId("#quote", 8, { focus: true });
            }}
            className={BTN_PRIMARY}
          >
            See Pricing
          </button>
        </div>
      </div>
    </section>
  );
}
