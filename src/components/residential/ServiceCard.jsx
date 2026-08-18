"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Home, PackageOpen } from "lucide-react";
import { trackInstantQuoteClick } from "../../helpers/instantQuoteAnalytics";
import { HEADING_UPPER } from "../../helpers/typography.js";
import { scrollToId } from "../../helpers/scrollToId.js";

const SERVICE_THEMES = {
  standard: {
    border: "border-amber-200/80",
    iconBg: "bg-amber-100",
    iconColor: "text-[#c9a227]",
    tagline: "text-[#c9a227]",
    divider: "bg-amber-300/70",
    check: "text-[#c9a227]",
  },
  deep: {
    border: "border-[#a7eff1]/70",
    iconBg: "bg-[#a7eff1]/35",
    iconColor: "text-teal-700",
    tagline: "text-teal-600",
    divider: "bg-[#a7eff1]",
    check: "text-teal-600",
  },
  "move-out": {
    border: "border-orange-200/80",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    tagline: "text-orange-600",
    divider: "bg-orange-300/70",
    check: "text-orange-500",
  },
};

function ServiceIcon({ slug, className }) {
  if (slug === "move-out") {
    return <PackageOpen className={className} strokeWidth={1.75} aria-hidden />;
  }
  return <Home className={className} strokeWidth={1.75} aria-hidden />;
}

export default function ServiceCard({ service }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailHref = `/residential/services/${service.slug}`;
  const theme = SERVICE_THEMES[service.slug] ?? SERVICE_THEMES.standard;

  const goToQuote = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("level", service.levelKey);
    const destination = `${pathname}?${params.toString()}#quote`;
    trackInstantQuoteClick({
      buttonLocation: "service_card",
      buttonLabel: "Instant Quote + Book",
      destination,
      serviceLevel: service.levelKey,
    });
    router.replace(destination, { scroll: false });
    window.requestAnimationFrame(() => {
      scrollToId("#quote", 8, { focus: true });
    });
  };

  return (
    <div
      className={`flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm ${theme.border}`}
    >
      <div className="flex gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${theme.iconBg}`}
        >
          <ServiceIcon slug={service.slug} className={`h-6 w-6 ${theme.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-bold leading-snug ${HEADING_UPPER} text-stone-900`}>
              {service.title}
            </h3>
            <span className={`shrink-0 text-sm italic ${theme.tagline}`}>{service.price}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-stone-700">{service.desc}</p>

      <div className={`my-4 h-px w-full ${theme.divider}`} aria-hidden />

      <ul className="space-y-2 text-sm text-stone-700">
        {service.items.map((item) => {
          const isLeadIn = item.includes("Everything in Deep Clean");
          return (
            <li key={item} className="flex gap-2.5">
              {!isLeadIn && (
                <Check
                  className={`mt-0.5 h-4 w-4 shrink-0 ${theme.check}`}
                  strokeWidth={2.5}
                  aria-hidden
                />
              )}
              <span className={isLeadIn ? "font-semibold text-stone-800" : undefined}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-6">
        <button
          type="button"
          onClick={goToQuote}
          className="uppercase tracking-wide inline-flex w-full items-center justify-center rounded-xl border border-amber-300 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Instant Quote + Book
        </button>

        <Link
          href={detailHref}
          aria-label={`Learn more about ${service.title}`}
          className="uppercase tracking-wide inline-flex w-full items-center justify-center rounded-xl border border-[#a7eff1]/50 bg-[#a7eff1]/25 px-4 py-2.5 text-sm font-semibold text-[#333333] hover:bg-[#a7eff1]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
