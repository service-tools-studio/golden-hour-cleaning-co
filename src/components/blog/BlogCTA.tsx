import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TrackedInstantQuoteLink from "@/components/analytics/TrackedInstantQuoteLink";

export default function BlogCTA() {
  return (
    <section className="mt-20 mb-10 px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#dcbb52]/20 bg-[#a7eff1] px-8 py-14 text-center shadow-sm">
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#a7eff1]" />

        <h2 className="text-3xl font-semibold text-[#333333]">
          Ready for a Cleaner Home?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#333333]/80">
          Whether you&apos;re looking for recurring home cleaning, a one-time deep
          clean, or help preparing for a move, we&apos;d love the opportunity to care
          for your home.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-[#333333]/70">
          Explore our residential cleaning services and discover how Golden Hour
          Cleaning Co. can help you spend less time cleaning and more time
          enjoying your home.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/residential/services"
            className="inline-flex items-center justify-center rounded-full bg-[#dcbb52] px-8 py-4 font-medium text-[#333333] transition-all duration-200 hover:scale-[1.02] hover:brightness-95"
          >
            Explore Residential Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <TrackedInstantQuoteLink
            href="/residential/services#quote"
            buttonLocation="blog_cta"
            buttonLabel="Get an Instant Quote"
            className="inline-flex items-center justify-center rounded-full border border-[#333333]/15 bg-white px-8 py-4 font-medium text-[#333333] transition-all duration-200 hover:bg-[#a7eff1]/20"
          >
            Get an Instant Quote
          </TrackedInstantQuoteLink>
        </div>
      </div>
    </section>
  );
}
