"use client";

import Link from "next/link";
import { CONTACT } from "../../constants.js";
import { trackInstantQuoteClick } from "../../helpers/instantQuoteAnalytics";
import { scrollToId } from "../../helpers/scrollToId.js";
import { BTN_UPPER } from "../../helpers/typography.js";

const SHARED_WIDTH = "w-[220px]";

export default function HeaderCTAButtons({ compact = false, quoteHref }) {
  const buttonLocation = compact ? "header_mobile_sticky" : "header_desktop";
  const linkClass = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-medium" : `shrink-0 ${SHARED_WIDTH} px-5 py-3 text-sm font-medium`}`;
  const buttonClass = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-semibold" : `shrink-0 ${SHARED_WIDTH} px-4 py-2.5 text-sm font-semibold lg:px-5 lg:py-3`}`;

  const quoteControl = quoteHref ? (
    <Link
      href={quoteHref}
      onClick={() =>
        trackInstantQuoteClick({
          buttonLocation,
          buttonLabel: "Instant Quote + Book",
          destination: quoteHref,
        })
      }
      className={buttonClass}
      aria-label="Get an instant quote and see real-time availability"
    >
      Instant Quote + Book
    </Link>
  ) : (
    <button
      type="button"
      aria-label="Get an instant quote and see real-time availability"
      onClick={(e) => {
        e.preventDefault();
        trackInstantQuoteClick({
          buttonLocation,
          buttonLabel: "Instant Quote + Book",
          destination: "#quote-calculator-heading",
        });
        scrollToId("#quote-calculator-heading", 8, { focus: true });
      }}
      className={buttonClass}
    >
      Instant Quote + Book
    </button>
  );

  return (
    <>
      <a
        href={`tel:${CONTACT.phone}`}
        className={linkClass}
        aria-label="Call us"
      >
        Call Us
      </a>
      {quoteControl}
    </>
  );
}
