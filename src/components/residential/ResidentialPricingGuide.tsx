"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  PackageOpen,
  Sparkles,
} from "lucide-react";
import { SERVICE_THEMES } from "./serviceCardTheme";
import {
  RESIDENTIAL_SERVICES,
  type ServiceSlug,
} from "@/data/residentialServices";
import {
  formatStartingAt,
  STARTING_AT_TIERS,
} from "@/lib/startingAtPricing.js";
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
  /** e.g. "Home over 2,000 sq ft?" */
  largeHomePrompt?: string;
};

const PRICING_CARD_THEMES = {
  standard: {
    ...SERVICE_THEMES.standard,
    tableBorder: "border-amber-200",
    rowDivider: "border-amber-100",
    accent: SERVICE_THEMES.standard.tagline,
  },
  deep: {
    ...SERVICE_THEMES.deep,
    tableBorder: "border-[#a7eff1]",
    rowDivider: "border-[#a7eff1]/40",
    accent: SERVICE_THEMES.deep.tagline,
  },
  "move-out": {
    ...SERVICE_THEMES["move-out"],
    tableBorder: "border-orange-200",
    rowDivider: "border-orange-100",
    accent: SERVICE_THEMES["move-out"].tagline,
  },
} as const;

const LEARN_MORE_BUTTON_CLASS = {
  standard:
    "border-amber-200/80 bg-amber-50 hover:bg-amber-100 text-stone-900",
  deep: "border-[#a7eff1]/50 bg-[#a7eff1]/25 hover:bg-[#a7eff1]/40 text-stone-900",
  "move-out":
    "border-orange-200/80 bg-orange-50 hover:bg-orange-100 text-stone-900",
} as const;

function tiersForSlug(slug: ServiceSlug): PricingTierRow[] {
  const key = slug === "move-out" ? "move_out" : slug;
  return STARTING_AT_TIERS[key].map((tier) => ({
    sqftLabel: tier.sqftLabel,
    startingAt: formatStartingAt(tier.startingAt),
  }));
}

const PRICING_BLOCKS: ServicePricingBlock[] = [
  {
    serviceSlug: "deep",
    displayTitle: "Deep Cleaning",
    tiers: tiersForSlug("deep"),
    largeHomePrompt: "Home over 2,000 sq ft?",
  },
  {
    serviceSlug: "move-out",
    displayTitle: "Move-in/out Cleaning",
    tiers: tiersForSlug("move-out"),
    largeHomePrompt: "Home over 2,000 sq ft?",
  },
  {
    serviceSlug: "standard",
    displayTitle: "Recurring Cleaning",
    subtitle: "Weekly or Bi-weekly",
    tiers: tiersForSlug("standard"),
    largeHomePrompt: "Home over 3,000 sq ft?",
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
  learnMoreLabel = "Learn more",
  onLearnMore,
  quoteHref = "/request-a-quote",
  onRequestQuote,
}: {
  block: ServicePricingBlock;
  hideIncluded?: boolean;
  learnMoreLabel?: string;
  onLearnMore?: () => void;
  quoteHref?: string;
  onRequestQuote?: () => void;
}) {
  const service = RESIDENTIAL_SERVICES[block.serviceSlug];
  const theme = PRICING_CARD_THEMES[block.serviceSlug];
  const learnMoreClass = `${BTN_UPPER} mt-6 inline-flex w-full items-center justify-center rounded-2xl border px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${LEARN_MORE_BUTTON_CLASS[block.serviceSlug]}`;

  return (
    <article
      id={pricingCardId(block.serviceSlug)}
      tabIndex={-1}
      className={`scroll-mt-[calc(var(--header-height,120px)+var(--pricing-jump-nav-height,0px)+16px)] rounded-3xl border bg-white p-6 shadow-sm md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${theme.border}`}
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

          {block.largeHomePrompt ? (
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              <span className="font-semibold text-stone-800">
                {block.largeHomePrompt}
              </span>{" "}
              {onRequestQuote ? (
                <button
                  type="button"
                  onClick={onRequestQuote}
                  className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
                >
                  Request a personalized quote →
                </button>
              ) : (
                <Link
                  href={quoteHref}
                  className="font-semibold text-stone-800 underline underline-offset-2 hover:text-stone-950"
                >
                  Request a personalized quote →
                </Link>
              )}
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Final pricing depends on home size, condition and cleaning needs.
          </p>
        </div>

        {!hideIncluded ? (
          <div className="md:border-l md:border-stone-100 md:pl-8 lg:pl-10">
            <h4
              className={`text-sm font-bold ${HEADING_UPPER} ${theme.accent}`}
            >
              What&apos;s included:
            </h4>
            <ServiceItemsList items={service.items} checkClass={theme.check} />
            <p className="mt-3 text-sm text-stone-600">
              And more — see full details for the complete list.
            </p>
            {onLearnMore ? (
              <button
                type="button"
                onClick={onLearnMore}
                aria-label={`${learnMoreLabel} about ${service.title}`}
                className={learnMoreClass}
              >
                {learnMoreLabel}
              </button>
            ) : (
              <Link
                href={`/residential/services/${block.serviceSlug}`}
                aria-label={`${learnMoreLabel} about ${service.title}`}
                className={learnMoreClass}
              >
                {learnMoreLabel}
              </Link>
            )}
          </div>
        ) : null}
      </div>
    </article>
  );
}

type ResidentialPricingGuideProps = {
  className?: string;
  showIntro?: boolean;
  /** When set (e.g. city landings), intro refers to "your {homeLocation} home". */
  homeLocation?: string;
};

const JUMP_NAV_ACTIVE_CLASS = {
  standard: "bg-amber-100 text-stone-900 shadow-sm",
  deep: "bg-[#a7eff1]/50 text-teal-900 shadow-sm",
  "move-out": "bg-orange-100 text-orange-950 shadow-sm",
} as const;

export function ServicePricingCards({
  className = "",
  serviceSlug,
  hideIncluded = false,
  learnMoreLabel,
  onLearnMore,
  quoteHref,
  onRequestQuote,
}: {
  className?: string;
  serviceSlug?: ServiceSlug;
  hideIncluded?: boolean;
  learnMoreLabel?: string;
  onLearnMore?: () => void;
  quoteHref?: string;
  onRequestQuote?: () => void;
}) {
  const blocks = serviceSlug
    ? PRICING_BLOCKS.filter((block) => block.serviceSlug === serviceSlug)
    : PRICING_BLOCKS;
  const showJumpNav = blocks.length > 1;
  const jumpNavRef = useRef<HTMLElement>(null);
  const [activeSlug, setActiveSlug] = useState<ServiceSlug>(
    blocks[0]?.serviceSlug ?? "deep",
  );
  const observedSlugs = blocks.map((block) => block.serviceSlug).join(",");

  useLayoutEffect(() => {
    const el = jumpNavRef.current;
    if (!el) {
      document.documentElement.style.removeProperty("--pricing-jump-nav-height");
      return;
    }

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--pricing-jump-nav-height",
        `${el.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--pricing-jump-nav-height");
    };
  }, [showJumpNav]);

  useEffect(() => {
    if (!showJumpNav) return;

    const slugs = observedSlugs.split(",") as ServiceSlug[];
    const elements = slugs
      .map((slug) => document.getElementById(pricingCardId(slug)))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const updateActive = () => {
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (!bestId || bestRatio <= 0) return;
      const slug = bestId.replace(/^pricing-/, "") as ServiceSlug;
      setActiveSlug(slug);
    };

    const stickyOffset = () => {
      const header = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height",
        ),
        10,
      );
      const nav = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--pricing-jump-nav-height",
        ),
        10,
      );
      return (
        (Number.isFinite(header) ? header : 120) +
        (Number.isFinite(nav) ? nav : 0)
      );
    };

    let observer: IntersectionObserver | null = null;

    const connect = () => {
      observer?.disconnect();
      ratios.clear();
      const top = stickyOffset();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(
              entry.target.id,
              entry.isIntersecting ? entry.intersectionRatio : 0,
            );
          }
          updateActive();
        },
        {
          root: null,
          rootMargin: `-${Math.max(top, 0)}px 0px -45% 0px`,
          threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
        },
      );
      for (const el of elements) observer.observe(el);
    };

    connect();
    window.addEventListener("resize", connect);
    return () => {
      window.removeEventListener("resize", connect);
      observer?.disconnect();
    };
  }, [observedSlugs, showJumpNav]);

  return (
    <div className={className?.trim() || undefined}>
      {showJumpNav ? (
        <nav
          ref={jumpNavRef}
          aria-label="Jump to a service"
          className="sticky top-[var(--header-height,120px)] z-30 -mx-4 mb-8 bg-amber-50/95 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-amber-50/80 md:-mx-0 md:px-0"
        >
          <div className="flex justify-center">
            <ul className="inline-flex max-w-full flex-nowrap items-center justify-center gap-0.5 rounded-2xl border border-stone-200 bg-white p-1 shadow-sm sm:gap-1 sm:p-1.5">
              {blocks.map((block) => {
                const theme = PRICING_CARD_THEMES[block.serviceSlug];
                const isActive = activeSlug === block.serviceSlug;
                return (
                  <li key={block.serviceSlug} className="min-w-0 shrink">
                    <a
                      href={`#${pricingCardId(block.serviceSlug)}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`${BTN_UPPER} inline-flex max-w-full items-center rounded-xl px-2 py-1.5 text-[11px] font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm ${
                        isActive
                          ? JUMP_NAV_ACTIVE_CLASS[block.serviceSlug]
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        setActiveSlug(block.serviceSlug);
                        const navH = jumpNavRef.current?.offsetHeight ?? 0;
                        scrollToId(`#${pricingCardId(block.serviceSlug)}`, navH + 12, {
                          focus: true,
                        });
                      }}
                    >
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full sm:mr-2 sm:h-2 sm:w-2 ${theme.divider}`}
                        aria-hidden
                      />
                      <span className="truncate">
                        {block.displayTitle
                          .replace(/Cleaning$/i, "")
                          .replace(/Clean$/i, "")
                          .trim()}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      ) : null}

      <div className="space-y-12 md:space-y-14">
        {blocks.map((block) => (
          <ServicePricingCard
            key={block.serviceSlug}
            block={block}
            hideIncluded={hideIncluded}
            learnMoreLabel={learnMoreLabel}
            onLearnMore={onLearnMore}
            quoteHref={quoteHref}
            onRequestQuote={onRequestQuote}
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

export default function ResidentialPricingGuide({
  className = "",
  showIntro = true,
  homeLocation,
}: ResidentialPricingGuideProps) {
  const homePhrase = homeLocation
    ? `your ${homeLocation} home`
    : "your home";

  return (
    <section
      id="quote-calculator"
      aria-labelledby={showIntro ? "pricing-guide-heading" : undefined}
      className={`mx-auto max-w-5xl px-4 lg:max-w-6xl ${className}`.trim()}
    >
      {showIntro ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-guide-heading"
            tabIndex={-1}
            className={`text-2xl leading-tight text-stone-900 md:text-3xl ${HEADING_UPPER} focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`}
          >
            Cleaning Services &amp; Pricing
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 md:text-base">
            Choose the level of care that fits {homePhrase}. Explore our starting
            prices and what&apos;s included, then book online or request a
            personalized quote when you&apos;re ready.
          </p>
        </header>
      ) : null}

      <ServicePricingCards className={showIntro ? "mt-10" : undefined} />
    </section>
  );
}
