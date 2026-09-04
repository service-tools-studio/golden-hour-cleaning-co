import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SEE_PRICING_BOOK_LABEL } from "@/helpers/ctaLabels.js";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/helpers/typography.js";

export default function BlogCTA() {
  return (
    <section className="mt-20 mb-10 px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200/40 bg-[#a7eff1] px-8 py-14 text-center shadow-sm">
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-amber-400/60" />

        <h2 className="text-3xl font-semibold text-stone-900">
          Ready for a Cleaner Home?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-700">
          Whether you&apos;re looking for recurring home cleaning, a one-time deep
          clean, or help preparing for a move, we&apos;d love the opportunity to care
          for your home.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-stone-600">
          Explore our residential cleaning services and discover how Golden Hour
          Cleaning Co. can help you spend less time cleaning and more time
          enjoying your home.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/residential/services" className={BTN_PRIMARY}>
            Explore Residential Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <TrackedInstantQuoteLink
            href="/residential/services#services"
            buttonLocation="blog_cta"
            buttonLabel={SEE_PRICING_BOOK_LABEL}
            className={BTN_SECONDARY}
          >
            {SEE_PRICING_BOOK_LABEL}
          </TrackedInstantQuoteLink>
        </div>
      </div>
    </section>
  );
}
