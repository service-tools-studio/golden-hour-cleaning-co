import type { Metadata } from "next";
import CleaningLeadForm from "@/components/residential/CleaningLeadForm";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Reserve Your Cleaning | Golden Hour Cleaning Co.",
  description:
    "Reserve a residential cleaning appointment online with Golden Hour Cleaning Co. Tell us about your home, then choose an available cleaning time.",
};

export default function BookOnlinePage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <header className="mx-auto max-w-2xl text-center">
            <h1
              className={`text-3xl leading-tight text-stone-900 md:text-4xl ${HEADING_UPPER}`}
            >
              Reserve Your Cleaning
            </h1>
            <p className="mt-3 text-base leading-relaxed text-stone-600 md:text-lg">
              Tell us a little about your home, then choose an available cleaning
              time. We&apos;ll confirm your final price during a brief walkthrough
              before cleaning begins.
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
