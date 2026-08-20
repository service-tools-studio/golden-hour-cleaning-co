"use client";

import { usePathname, useRouter } from "next/navigation";
import { CONTACT } from "../../constants.js";
import { trackInstantQuoteClick } from "../../helpers/instantQuoteAnalytics";
import { scrollToId } from "../../helpers/scrollToId.js";
import { BTN_UPPER } from "../../helpers/typography.js";

const SHARED_WIDTH = "w-[220px]";

function stripLevelFromHref(href) {
  const url = new URL(href, "https://goldenhour.local");
  url.searchParams.delete("level");
  const search = url.searchParams.toString();
  const hash = url.hash || "#quote";
  return `${url.pathname}${search ? `?${search}` : ""}${hash}`;
}

export default function HeaderCTAButtons({ compact = false, quoteHref }) {
  const router = useRouter();
  const pathname = usePathname();
  const buttonLocation = compact ? "header_mobile_sticky" : "header_desktop";
  const linkClass = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-medium" : `shrink-0 ${SHARED_WIDTH} px-5 py-3 text-sm font-medium`}`;
  const buttonClass = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 text-slate-900 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-300 whitespace-nowrap ${compact ? "min-w-0 flex-1 shrink px-3 py-2 text-xs font-semibold" : `shrink-0 ${SHARED_WIDTH} px-4 py-2.5 text-sm font-semibold lg:px-5 lg:py-3`}`;

  function goToQuote(e) {
    e.preventDefault();

    const destination = quoteHref
      ? stripLevelFromHref(quoteHref)
      : `${pathname}#quote`;

    trackInstantQuoteClick({
      buttonLocation,
      buttonLabel: "Instant Quote + Book",
      destination,
    });

    const targetPath = quoteHref
      ? new URL(quoteHref, "https://goldenhour.local").pathname
      : pathname;
    const isSamePath = targetPath === pathname;

    if (isSamePath) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("level")) {
        url.searchParams.delete("level");
        const search = url.searchParams.toString();
        router.replace(`${url.pathname}${search ? `?${search}` : ""}`, {
          scroll: false,
        });
      }
      window.requestAnimationFrame(() => {
        scrollToId("#quote-calculator-heading", 8, { focus: true });
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
      >
        Call Us
      </a>
      <button
        type="button"
        aria-label="Get an instant quote and see real-time availability"
        onClick={goToQuote}
        className={buttonClass}
      >
        Instant Quote + Book
      </button>
    </>
  );
}
