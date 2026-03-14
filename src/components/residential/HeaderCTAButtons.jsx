"use client";

import { CONTACT } from "../../constants.js";
import { scrollToId } from "../../helpers/scrollToId.js";

const SHARED_WIDTH = "w-[220px]";

export default function HeaderCTAButtons({ compact = false }) {
  const linkClass = `inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-medium" : `shrink-0 ${SHARED_WIDTH} px-5 py-3 text-sm font-medium`}`;
  const buttonClass = `inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-semibold" : `shrink-0 ${SHARED_WIDTH} px-4 py-2.5 text-sm font-semibold md:px-5 md:py-3`}`;
  return (
    <>
      <a
        href={`tel:${CONTACT.phone}`}
        className={linkClass}
        aria-label="Call us"
      >
        Call Us
      </a>
      <button
        type="button"
        aria-label="Get an instant quote and see real-time availability"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("#quote-calculator", 8);
        }}
        className={buttonClass}
      >
        Instant Quote + Booking
      </button>
    </>
  );
}
