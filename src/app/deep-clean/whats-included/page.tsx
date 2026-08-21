import type { Metadata } from "next";
import Link from "next/link";
import DeepCleanChecklist from "@/components/residential/DeepCleanChecklist";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Deep Clean Checklist | What's Included | Golden Hour Cleaning Co.",
  description:
    "See exactly what's included in a Golden Hour deep clean — kitchen, bathrooms, bedrooms, living areas, and detailed work throughout the home.",
};

export default function DeepCleanWhatsIncludedPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/portland-deep-cleaning#quote" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/residential/services/deep"
            className="uppercase tracking-wide mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
          >
            ← Deep clean service
          </Link>

          <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            What&apos;s Included in a Deep Clean
          </h1>

          <div className="mt-8">
            <DeepCleanChecklist />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
