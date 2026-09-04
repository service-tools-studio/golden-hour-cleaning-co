import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import RequestQuoteClient from "./RequestQuoteClient";

export const metadata: Metadata = {
  title: "Request a Quote | Golden Hour Cleaning Co.",
  description:
    "Request a personalized residential cleaning quote from Golden Hour Cleaning Co. Tell us about your home and we'll follow up with pricing and next steps.",
};

export default function RequestAQuotePage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <RequestQuoteClient />
        </div>

        <Footer />
      </main>
    </>
  );
}
