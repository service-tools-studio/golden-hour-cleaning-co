import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import SatisfactionGuaranteeContent from "@/components/residential/SatisfactionGuaranteeContent";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Satisfaction Guarantee | Golden Hour Cleaning Co.",
  description:
    "If something included in your Golden Hour cleaning was missed or wasn't completed to our standard, let us know within 24 hours and we'll come back to make it right.",
};

export default function SatisfactionGuaranteePage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <SatisfactionGuaranteeContent />
        </article>

        <Footer />
      </main>
    </>
  );
}
