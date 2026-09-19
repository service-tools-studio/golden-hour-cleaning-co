import type { Metadata } from "next";
import CleaningLeadForm from "@/components/residential/CleaningLeadForm";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Reserve Your Cleaning in Portland, OR | Golden Hour Cleaning Co.",
  description:
    "Reserve a residential cleaning appointment online with Golden Hour Cleaning Co. Serving Portland and the metro area — tell us about your home, then choose an available time.",
  alternates: { canonical: "/book-online" },
};

export default function BookOnlinePage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <h1
              className={`text-3xl leading-tight text-stone-900 md:text-4xl ${HEADING_UPPER}`}
            >
              Reserve Your Cleaning
            </h1>
            <p
              className={`mt-4 whitespace-nowrap text-[clamp(0.65rem,2.7vw,0.875rem)] font-semibold text-stone-800 ${HEADING_UPPER}`}
            >
              <span className="text-amber-700">1</span>
              <span className="mx-[0.3em] font-normal text-stone-400">·</span>
              Contact
              <span className="mx-[0.4em] font-normal text-stone-400" aria-hidden>
                →
              </span>
              <span className="text-amber-700">2</span>
              <span className="mx-[0.3em] font-normal text-stone-400">·</span>
              Home details
              <span className="mx-[0.4em] font-normal text-stone-400" aria-hidden>
                →
              </span>
              <span className="text-amber-700">3</span>
              <span className="mx-[0.3em] font-normal text-stone-400">·</span>
              Pick a time
            </p>
            <p className="mx-auto mt-5 max-w-md rounded-2xl border border-amber-300 bg-amber-100 px-4 py-2.5 text-center text-sm font-semibold leading-snug text-amber-950 text-pretty sm:max-w-none sm:text-base sm:leading-normal">
              Daily availability, including same-day{" "}
              <span className="font-medium text-amber-800/80">
                (submit by 12pm)
              </span>{" "}
              and next-day.
            </p>
            <p className="mt-4 text-base leading-relaxed text-stone-600 md:text-lg">
              Tell us a little about your home, then choose a time on our live
              calendar. You&apos;ll reserve an arrival window — we confirm your
              final price during a brief walkthrough before cleaning begins.
            </p>
          </header>

          <div className="mt-10">
            <CleaningLeadForm mode="booking" />
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
