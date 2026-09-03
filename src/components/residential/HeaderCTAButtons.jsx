"use client";

import { usePathname, useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT } from "../../constants.js";
import { trackInstantQuoteClick } from "../../helpers/instantQuoteAnalytics";
import {
  SEE_PRICING_BOOK_ARIA,
  SEE_PRICING_BOOK_LABEL,
  SERVICES_PRICING_HASH,
  SERVICES_PRICING_HREF,
} from "../../helpers/ctaLabels.js";
import { scrollToId } from "../../helpers/scrollToId.js";
import { BTN_UPPER } from "../../helpers/typography.js";

const SHARED_WIDTH = "w-[220px]";

/** Canonical regular (non-PPC) pricing section on the services page. */
export const REGULAR_QUOTE_HREF = SERVICES_PRICING_HREF;
const REGULAR_QUOTE_PATH = "/residential/services";

export default function HeaderCTAButtons({
  compact = false,
  // Kept for call-site compatibility; header Instant Quote always uses the regular calculator.
  quoteHref: _quoteHref,
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const buttonLocation = compact ? "header_mobile_sticky" : "header_desktop";
  const linkClass = `${BTN_UPPER} inline-flex items-center justify-center gap-1.5 rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-medium" : `shrink-0 ${SHARED_WIDTH} px-5 py-3 text-sm font-medium`}`;
  const buttonClass = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-semibold" : `shrink-0 ${SHARED_WIDTH} px-4 py-2.5 text-sm font-semibold lg:px-5 lg:py-3`}`;

  function goToQuote(e) {
    e.preventDefault();

    const destination = REGULAR_QUOTE_HREF;

    trackInstantQuoteClick({
      buttonLocation,
      buttonLabel: SEE_PRICING_BOOK_LABEL,
      destination,
    });

    const onPricingPage =
      pathname === REGULAR_QUOTE_PATH ||
      pathname === `${REGULAR_QUOTE_PATH}/` ||
      pathname?.startsWith(`${REGULAR_QUOTE_PATH}/`);

    if (onPricingPage) {
      if (
        pathname === REGULAR_QUOTE_PATH ||
        pathname === `${REGULAR_QUOTE_PATH}/`
      ) {
        const url = new URL(window.location.href);
        if (url.searchParams.has("level")) {
          url.searchParams.delete("level");
          const search = url.searchParams.toString();
          router.replace(`${url.pathname}${search ? `?${search}` : ""}`, {
            scroll: false,
          });
        }
      }
      window.requestAnimationFrame(() => {
        const scrollTarget = pathname?.startsWith(`${REGULAR_QUOTE_PATH}/`)
          ? "#pricing"
          : SERVICES_PRICING_HASH;
        scrollToId(scrollTarget, 8, { focus: true });
      });
      return;
    }

    router.push(destination);
  }

  return (
    <>
      <a
        href={`tel:${CONTACT.phone}`}
        className={linkClass}
        aria-label="Call us"
        data-call-source="header_call_us"
      >
        <Phone
          className={compact ? "h-3 w-3 shrink-0" : "h-3.5 w-3.5 shrink-0"}
          aria-hidden
        />
        Call Us
      </a>
      <button
        type="button"
        aria-label={SEE_PRICING_BOOK_ARIA}
        onClick={goToQuote}
        className={buttonClass}
      >
        {SEE_PRICING_BOOK_LABEL}
      </button>
    </>
  );
}
