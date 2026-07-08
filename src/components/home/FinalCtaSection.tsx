import Link from "next/link";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";
import { CONTACT } from "@/constants.js";
import { BTN_UPPER, HEADING_UPPER } from "@/helpers/typography.js";

export default function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="bg-[#a7eff1] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2
          id="final-cta-heading"
          className={`text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
        >
          Ready for a Cleaner Space?
        </h2>
        <p className="mt-6 text-base leading-relaxed text-stone-800 sm:text-lg">
          Get an instant quote and book online in just a few minutes.
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-700">
          Prefer to speak with someone? Our friendly team is happy to answer your
          questions and help you find the cleaning service that&apos;s right for your
          home or business.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedInstantQuoteLink
            href="/residential/services#quote"
            buttonLocation="home_final_cta"
            buttonLabel="Get Instant Quote"
            className={`${BTN_UPPER} inline-flex w-full items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-amber-300 sm:w-auto sm:min-w-[220px]`}
          >
            Get Instant Quote
          </TrackedInstantQuoteLink>
          <a
            href={`tel:${CONTACT.phone}`}
            className={`${BTN_UPPER} inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-900 shadow-sm transition hover:bg-stone-50 sm:w-auto sm:min-w-[220px]`}
          >
            Call (503) 893-4795
          </a>
        </div>
      </div>
    </section>
  );
}
