"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ClipboardList,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import {
  formatStartingAt,
  STARTING_AT_TIERS,
} from "@/lib/startingAtPricing.js";
import type { ServiceSlug } from "@/data/residentialServices";
import { useGooglePlaceSummary } from "@/helpers/useGooglePlaceSummary";
import { SERVICE_THEMES } from "./serviceCardTheme";
import { BackToServicesLink } from "./servicePageParts";
import { BTN_PRIMARY, BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

const HIGHLIGHTS = [
  { id: "google-rating", label: null, Icon: Star },
  { id: "vetted", label: "Vetted & trusted team", Icon: ShieldCheck },
  { id: "custom", label: "Custom to your home's needs", Icon: ClipboardList },
  { id: "satisfaction", label: "Satisfaction guaranteed", Icon: ThumbsUp },
] as const;

function pricingKeyForSlug(slug: ServiceSlug) {
  return slug === "move-out" ? "move_out" : slug;
}

function largeHomePrompt(slug: ServiceSlug) {
  if (slug === "standard") return "Home over 3,000 sq ft?";
  return "Home over 2,000 sq ft?";
}

export type ServiceDetailHeroProps = {
  serviceSlug: ServiceSlug;
  tagline: string;
  title: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  includedItems: string[];
  includedLeadIn?: string;
  checklistHref: string;
  quoteHref?: string;
};

export default function ServiceDetailHero({
  serviceSlug,
  tagline,
  title,
  intro,
  imageSrc,
  imageAlt,
  includedItems,
  includedLeadIn,
  checklistHref,
  quoteHref = "/request-a-quote",
}: ServiceDetailHeroProps) {
  const theme = SERVICE_THEMES[serviceSlug];
  const tiers = STARTING_AT_TIERS[pricingKeyForSlug(serviceSlug)];
  const { rating } = useGooglePlaceSummary();
  const googleRatingLabel = `★★★★★ ${(rating ?? 5).toFixed(1)} Google Rating`;
  const leadInItem = includedItems.find((item) =>
    item.includes("Everything in Deep Clean"),
  );
  const checklistItems = includedItems.filter(
    (item) => !item.includes("Everything in Deep Clean"),
  );

  return (
    <div>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
        {/* Left column */}
        <div>
          <BackToServicesLink />
          <p className={`mt-2 text-sm font-semibold ${HEADING_UPPER} ${theme.tagline}`}>
            {tagline}
          </p>
          <h1
            className={`mt-2 text-3xl leading-tight text-stone-900 md:text-4xl lg:text-[2.75rem] ${HEADING_UPPER}`}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-700 md:text-lg">
            {intro}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {HIGHLIGHTS.map(({ id, label, Icon }) => (
              <li key={id} className="flex flex-col items-start gap-2">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${theme.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${theme.iconColor}`} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-xs font-medium leading-snug text-stone-700">
                  {label ?? googleRatingLabel}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <CalendarDays
                    className="h-5 w-5 text-amber-500"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <p className="text-sm leading-relaxed text-stone-800">
                  Ready to get on the schedule? Choose your preferred date and
                  time online.
                </p>
              </div>
              <a
                href="/book-online"
                className={`${BTN_PRIMARY} shrink-0 px-5`}
              >
                Book Online →
              </a>
            </div>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            We&apos;ll confirm your exact price during our walkthrough before we
            begin the cleaning.
          </p>

          <section id="pricing" className="mt-10 scroll-mt-[var(--header-height,120px)]">
            <h2 className={`text-sm font-bold ${HEADING_UPPER} ${theme.tagline}`}>
              Starting Prices
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="grid divide-y divide-stone-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {tiers.map((tier) => (
                  <div key={tier.sqftLabel} className="px-4 py-5 text-center">
                    <p className="text-sm text-stone-600">{tier.sqftLabel}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                      Starting at
                    </p>
                    <p
                      className={`mt-1 text-2xl font-bold tabular-nums ${theme.tagline}`}
                    >
                      {formatStartingAt(tier.startingAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              <span className="font-semibold text-stone-800">
                {largeHomePrompt(serviceSlug)}
              </span>{" "}
              <Link
                href={quoteHref}
                className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
              >
                Request a personalized quote →
              </Link>
            </p>
          </section>
        </div>

        {/* Right column — mobile: included left / image right; desktop: image above included */}
        <div className="mt-10 grid grid-cols-2 items-start gap-3 sm:gap-5 lg:mt-0 lg:grid-cols-1 lg:gap-0">
          <section
            id="whats-included-preview"
            className="order-1 min-w-0 scroll-mt-[var(--header-height,120px)] lg:order-2 lg:mt-8"
          >
            <h2 className={`text-sm font-bold ${HEADING_UPPER} ${theme.tagline}`}>
              What&apos;s Included
            </h2>
            {(includedLeadIn || leadInItem) && (
              <p className="mt-2 text-xs font-semibold text-stone-800 sm:text-sm">
                {includedLeadIn || leadInItem}
              </p>
            )}
            <ul className="mt-3 grid gap-y-2 lg:mt-4 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-2.5">
              {checklistItems.map((item) => (
                <li key={item} className="flex gap-1.5 text-xs text-stone-700 sm:gap-2 sm:text-sm">
                  <Check
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${theme.check}`}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={checklistHref}
              className={`${BTN_UPPER} mt-4 inline-flex text-xs font-bold sm:mt-5 sm:text-sm ${theme.tagline} underline-offset-4 hover:underline`}
            >
              View Full Checklist →
            </Link>
          </section>

          <figure className="order-2 relative min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm sm:rounded-3xl lg:order-1">
            <div className="relative aspect-[3/4] w-full lg:aspect-[4/5]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1023px) 50vw, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="absolute bottom-2 right-2 max-w-[140px] rounded-xl border border-white/80 bg-white/95 px-2 py-1.5 shadow-md backdrop-blur-sm sm:bottom-4 sm:right-4 sm:max-w-[220px] sm:rounded-2xl sm:px-3.5 sm:py-3">
              <div className="flex gap-1.5 sm:gap-2.5">
                <ShieldCheck
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5 ${theme.iconColor}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="text-[10px] font-medium leading-snug text-stone-800 sm:text-xs">
                  We confirm your final price before we begin cleaning.
                </p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
