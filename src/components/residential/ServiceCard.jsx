"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { trackInstantQuoteClick } from "../../helpers/instantQuoteAnalytics";
import {
  SEE_PRICING_BOOK_LABEL,
  SERVICES_PRICING_HASH,
} from "../../helpers/ctaLabels.js";
import { BTN_PRIMARY, BTN_SECONDARY, HEADING_UPPER } from "../../helpers/typography.js";
import { scrollToId } from "../../helpers/scrollToId.js";
import { ServiceIcon, SERVICE_THEMES } from "./serviceCardTheme";

export default function ServiceCard({ service }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const detailHref = `/residential/services/${service.slug}`;
  const theme = SERVICE_THEMES[service.slug] ?? SERVICE_THEMES.standard;

  const goToQuote = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("level", service.levelKey);
    const destination = `${pathname}?${params.toString()}${SERVICES_PRICING_HASH}`;
    trackInstantQuoteClick({
      buttonLocation: "service_card",
      buttonLabel: SEE_PRICING_BOOK_LABEL,
      destination,
      serviceLevel: service.levelKey,
    });
    router.replace(destination, { scroll: false });
    window.requestAnimationFrame(() => {
      scrollToId(SERVICES_PRICING_HASH, 8, { focus: true });
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
          className={`${BTN_PRIMARY} w-full px-4 py-2.5`}
        >
          {SEE_PRICING_BOOK_LABEL}
        </button>

        <Link
          href={detailHref}
          aria-label={`Learn more about ${service.title}`}
          className={`${BTN_SECONDARY} w-full px-4 py-2.5`}
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
