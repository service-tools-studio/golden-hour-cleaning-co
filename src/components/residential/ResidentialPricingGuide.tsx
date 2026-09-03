"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  PackageOpen,
  Sparkles,
  Tag,
} from "lucide-react";
import { formatPhone } from "@/helpers/contactHelpers.js";
import ContactSheet from "./ContactSheet";
import { SERVICE_THEMES } from "./serviceCardTheme";
import { CONTACT } from "@/constants.js";
import {
  RESIDENTIAL_SERVICES,
  type ServiceSlug,
} from "@/data/residentialServices";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";
import { scrollToId } from "@/helpers/scrollToId";

type PricingTierRow = {
  sqftLabel: string;
  startingAt: string;
};

type ServicePricingBlock = {
  serviceSlug: ServiceSlug;
  displayTitle: string;
  subtitle?: string;
  tiers: PricingTierRow[];
  typicalRange?: string;
  showLargeHomeNote?: boolean;
};

const PRICING_CARD_THEMES = {
  standard: {
    ...SERVICE_THEMES.standard,
    tableBorder: "border-amber-200",
    rowDivider: "border-amber-100",
    tipBg: "bg-amber-50",
    accent: SERVICE_THEMES.standard.tagline,
  },
  deep: {
    ...SERVICE_THEMES.deep,
    tableBorder: "border-[#a7eff1]",
    rowDivider: "border-[#a7eff1]/40",
    tipBg: "bg-[#a7eff1]/15",
    accent: SERVICE_THEMES.deep.tagline,
  },
  "move-out": {
    ...SERVICE_THEMES["move-out"],
    tableBorder: "border-orange-200",
    rowDivider: "border-orange-100",
    tipBg: "bg-orange-50",
    accent: SERVICE_THEMES["move-out"].tagline,
  },
} as const;

const LEARN_MORE_BUTTON_CLASS = {
  standard:
    "border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-stone-900",
  deep: "border-[#a7eff1]/50 bg-[#a7eff1]/25 hover:bg-[#a7eff1]/40 text-[#333333]",
  "move-out":
    "border-orange-200/80 bg-orange-50 hover:bg-orange-100 text-stone-900",
} as const;

const PRICING_BLOCKS: ServicePricingBlock[] = [
  {
    serviceSlug: "deep",
    displayTitle: "Deep Cleaning",
    tiers: [
      { sqftLabel: "Homes up to 1,000 sq ft", startingAt: "$250" },
      { sqftLabel: "Homes up to 1,500 sq ft", startingAt: "$300" },
      { sqftLabel: "Homes up to 2,000 sq ft", startingAt: "$429" },
    ],
    typicalRange: "Most deep cleans range from $350–$650.",
    showLargeHomeNote: true,
  },
  {
    serviceSlug: "move-out",
    displayTitle: "Move-in/out Cleaning",
    tiers: [
      { sqftLabel: "Homes up to 1,000 sq ft", startingAt: "$350" },
      { sqftLabel: "Homes up to 1,500 sq ft", startingAt: "$460" },
      { sqftLabel: "Homes up to 2,000 sq ft", startingAt: "$660" },
    ],
    typicalRange: "Most moving cleans range from $450–$750.",
    showLargeHomeNote: true,
  },
  {
    serviceSlug: "standard",
    displayTitle: "Recurring Cleaning",
    subtitle: "Weekly or Bi-weekly",
    tiers: [
      { sqftLabel: "Homes up to 1,500 sq ft", startingAt: "$150" },
      { sqftLabel: "Homes up to 2,000 sq ft", startingAt: "$222" },
      { sqftLabel: "Homes up to 3,000 sq ft", startingAt: "$292" },
    ],
  },
];

function PricingServiceIcon({
  slug,
  className,
}: {
  slug: ServiceSlug;
  className: string;
}) {
  if (slug === "move-out") {
    return <PackageOpen className={className} strokeWidth={1.75} aria-hidden />;
  }
  if (slug === "standard") {
    return <CalendarDays className={className} strokeWidth={1.75} aria-hidden />;
  }
  return <Sparkles className={className} strokeWidth={1.75} aria-hidden />;
}

function SqftTierLabel({ label }: { label: string }) {
  const match = label.match(/^(.*?)(\d[\d,]*)\s*(sq\s*ft)$/i);
  if (!match) {
    return <span className="text-sm text-stone-700">{label}</span>;
  }

  const [, prefix, amount, unit] = match;
  return (
    <span className="text-sm text-stone-700">
      {prefix}
      <span className="text-base font-semibold text-stone-900 sm:text-lg">
        {amount} {unit}
      </span>
    </span>
  );
}

function ServiceItemsList({
  items,
  checkClass,
}: {
  items: string[];
  checkClass: string;
}) {
  return (
    <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
      {items.map((item) => {
        const isLeadIn = item.includes("Everything in Deep Clean");
        return (
          <li key={item} className="flex gap-2.5">
            {!isLeadIn ? (
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${checkClass}`}
                strokeWidth={2.5}
                aria-hidden
              />
            ) : null}
            <span className={isLeadIn ? "font-semibold text-stone-800" : undefined}>
              {item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function pricingCardId(slug: ServiceSlug) {
  return `pricing-${slug}`;
}

function ServicePricingCard({
  block,
  hideIncluded = false,
}: {
  block: ServicePricingBlock;
  hideIncluded?: boolean;
}) {
  const service = RESIDENTIAL_SERVICES[block.serviceSlug];
  const theme = PRICING_CARD_THEMES[block.serviceSlug];

  return (
    <article
      id={pricingCardId(block.serviceSlug)}
      tabIndex={-1}
      className={`scroll-mt-[calc(var(--header-height,120px)+12px)] rounded-3xl border bg-white p-6 shadow-sm md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${theme.border}`}
    >
      <div
        className={
          hideIncluded
            ? undefined
            : "grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12"
        }
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${theme.iconBg}`}
            >
              <PricingServiceIcon
                slug={block.serviceSlug}
                className={`h-5 w-5 ${theme.iconColor}`}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold leading-snug text-stone-900 md:text-xl ${HEADING_UPPER}`}
              >
                {block.displayTitle}
              </h3>
              {(block.subtitle ?? service.price) ? (
                <p className={`mt-0.5 text-sm ${theme.accent}`}>
                  {block.subtitle ?? service.price}
                </p>
              ) : null}
            </div>
          </div>

          <div
            className={`mt-5 overflow-hidden rounded-2xl border ${theme.tableBorder} bg-white`}
          >
            {block.tiers.map((tier, index) => (
              <div
                key={tier.sqftLabel}
                className={`flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${
                  index > 0 ? `border-t ${theme.rowDivider}` : ""
                }`}
              >
                <SqftTierLabel label={tier.sqftLabel} />
                <div className="flex flex-col sm:items-end">
                  <span className="text-xs font-normal normal-case tracking-normal text-stone-500">
                    Starting at
                  </span>
                  <span
                    className={`text-xl font-bold leading-tight ${theme.accent} ${HEADING_UPPER}`}
                  >
                    {tier.startingAt}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {block.showLargeHomeNote ? (
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              <span className="font-semibold text-stone-800">
                Home over 2,000 sq ft?
              </span>{" "}
              Larger homes are individually priced based on size and cleaning needs.{" "}
              <a
                href="#request-quote"
                className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId("#request-quote", 8, { focus: true });
                }}
              >
                Request a personalized quote →
              </a>
            </p>
          ) : null}

          {block.typicalRange ? (
            <div
              className={`mt-4 flex gap-3 rounded-2xl px-4 py-3 text-sm leading-relaxed text-stone-600 ${theme.tipBg}`}
            >
              <Tag
                className={`mt-0.5 h-4 w-4 shrink-0 ${theme.iconColor}`}
                aria-hidden
              />
              <p>
                <span className="font-semibold text-stone-800">Typical range:</span>{" "}
                {block.typicalRange} Final pricing depends on home size, condition
                and cleaning needs.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              Final pricing depends on home size, condition and cleaning needs.
            </p>
          )}
        </div>

        {!hideIncluded ? (
          <div className="md:border-l md:border-stone-100 md:pl-8 lg:pl-10">
            <h4
              className={`text-sm font-bold ${HEADING_UPPER} ${theme.accent}`}
            >
              What&apos;s included:
            </h4>
            <ServiceItemsList items={service.items} checkClass={theme.check} />
            <Link
              href={`/residential/services/${block.serviceSlug}`}
              aria-label={`Learn more about ${service.title}`}
              className={`${BTN_UPPER} mt-6 inline-flex w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${LEARN_MORE_BUTTON_CLASS[block.serviceSlug]}`}
            >
              Learn more
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}

type ResidentialPricingGuideProps = {
  className?: string;
  showIntro?: boolean;
};

export function ServicePricingCards({
  className = "",
  serviceSlug,
  hideIncluded = false,
}: {
  className?: string;
  serviceSlug?: ServiceSlug;
  hideIncluded?: boolean;
}) {
  const blocks = serviceSlug
    ? PRICING_BLOCKS.filter((block) => block.serviceSlug === serviceSlug)
    : PRICING_BLOCKS;
  const showJumpNav = blocks.length > 1;

  return (
    <div className={className?.trim() || undefined}>
      {showJumpNav ? (
        <nav
          aria-label="Jump to a service"
          className="mb-6 flex flex-wrap items-center justify-center gap-y-2 text-center"
        >
          {blocks.map((block, index) => (
            <span key={block.serviceSlug} className="inline-flex items-center">
              {index > 0 ? (
                <span className="px-2 text-stone-400 select-none" aria-hidden>
                  ·
                </span>
              ) : null}
              <a
                href={`#${pricingCardId(block.serviceSlug)}`}
                className="text-sm font-semibold text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToId(`#${pricingCardId(block.serviceSlug)}`, 8, {
                    focus: true,
                  });
                }}
              >
                {block.displayTitle.replace(/Cleaning$/, "Clean")}
              </a>
            </span>
          ))}
        </nav>
      ) : null}

      <div className="space-y-6">
        {blocks.map((block) => (
          <ServicePricingCard
            key={block.serviceSlug}
            block={block}
            hideIncluded={hideIncluded}
          />
        ))}
      </div>
    </div>
  );
}

type ServicePagePricingProps = {
  serviceSlug: ServiceSlug;
  serviceTitle: string;
  className?: string;
};

export function ServicePagePricing({
  serviceSlug,
  serviceTitle,
  className = "",
}: ServicePagePricingProps) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={className}
    >
      <h2
        id="pricing-heading"
        tabIndex={-1}
        className={`text-2xl leading-tight text-stone-900 md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
      >
        Typical pricing
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-600 md:text-base">
        Starting rates by home size for {serviceTitle.toLowerCase()}. Final pricing
        depends on condition and add-ons.
      </p>
      <ServicePricingCards
        serviceSlug={serviceSlug}
        hideIncluded
        className="mt-6"
      />
    </section>
  );
}

export function PricingGuideCTA() {
  const contactBtnRef = useRef(null);

  return (
    <div
      id="request-quote"
      className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8 md:p-8"
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <Sparkles
            className="h-5 w-5 text-[#c9a227]"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
        <div>
          <h3
            className={`text-lg font-bold text-stone-900 md:text-xl ${HEADING_UPPER}`}
          >
            Interested in Golden Hour?
          </h3>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-stone-600">
            Tell us a little about your home and we&apos;ll help you determine the
            right cleaning and price.
          </p>
        </div>
      </div>
      <div className="mt-6 flex shrink-0 flex-col items-stretch gap-3 md:mt-0 md:items-end">
        <ContactSheet
          ref={contactBtnRef}
          phone={CONTACT.phone}
          sms={CONTACT.sms}
          email={CONTACT.email}
          context={{ level: "deep", bedrooms: 3, bathrooms: 2 }}
          buttonLabel="Request a Personalized Quote →"
          buttonClassName={`${BTN_UPPER} inline-flex w-full items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-md transition hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300 md:w-auto md:min-w-[280px]`}
        />
        <a
          href={`tel:${CONTACT.phone}`}
          data-call-source="pricing_guide_call"
          className="text-center text-sm font-semibold text-stone-600 underline underline-offset-4 hover:text-stone-900 md:text-right"
        >
          Or call {formatPhone(CONTACT.phone)}
        </a>
      </div>
    </div>
  );
}

export default function ResidentialPricingGuide({
  className = "",
  showIntro = true,
}: ResidentialPricingGuideProps) {
  return (
    <section
      id="quote-calculator"
      aria-labelledby={showIntro ? "pricing-guide-heading" : undefined}
      className={`mx-auto max-w-5xl px-4 ${className}`.trim()}
    >
      {showIntro ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-guide-heading"
            tabIndex={-1}
            className={`text-2xl leading-tight text-stone-900 md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
          >
            Know what to expect before you contact us.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 md:text-base">
            We believe choosing a cleaning company shouldn&apos;t require making three
            phone calls just to understand what it might cost. Browse our typical
            pricing below, see exactly what&apos;s included, and reach out when
            you&apos;re ready.
          </p>
        </header>
      ) : null}

      <ServicePricingCards className={showIntro ? "mt-10" : undefined} />

      <div className={showIntro ? "mt-10" : undefined}>
        <PricingGuideCTA />
      </div>
    </section>
  );
}
