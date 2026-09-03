import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import PartnershipsPageContent from "@/components/residential/PartnershipsPageContent";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Partnerships | Golden Hour Cleaning Co.",
  description:
    "Golden Hour Cleaning Co. partners with property management teams and local organizations throughout the Portland metro area for dependable, detailed cleaning support.",
};

export default function PartnershipsPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <PartnershipsPageContent />
        </article>

        <Footer />
      </main>
    </>
  );
}
