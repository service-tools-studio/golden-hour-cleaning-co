import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/residential/Footer";
import MoveOutCleanChecklist from "@/components/residential/MoveOutCleanChecklist";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title:
    "Move-Out Clean Checklist | What's Included in Portland | Golden Hour Cleaning Co.",
  description:
    "See exactly what's included in a Golden Hour move-in and move-out clean in Portland and the metro area — kitchen, bathrooms, bedrooms, living areas, and detailed work throughout the home.",
  alternates: { canonical: "/move-out-clean/whats-included" },
};

export default function MoveOutCleanWhatsIncludedPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <Link
            href="/residential/services/move-out"
            className="uppercase tracking-wide mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
          >
            ← Move-out clean service
          </Link>

          <h1 className={`text-3xl leading-tight md:text-4xl ${HEADING_UPPER}`}>
            What&apos;s Included in a Move-In &amp; Move-Out Clean
          </h1>

          <div className="mt-8">
            <MoveOutCleanChecklist />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
