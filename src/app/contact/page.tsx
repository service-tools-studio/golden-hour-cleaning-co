import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/residential/ContactForm";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { HEADING_UPPER } from "@/helpers/typography.js";

export const metadata: Metadata = {
  title: "Contact Us | Golden Hour Cleaning Co.",
  description:
    "Contact Golden Hour Cleaning Co. with questions about house cleaning in Portland, Phoenix, and surrounding metro areas.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ServicesPageHeader />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <header>
            <h1 className={`text-3xl md:text-4xl ${HEADING_UPPER}`}>
              Contact Us
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700">
              Send us a message — we&apos;ll reply by email or phone. For
              cleaning quotes and scheduling, you can also{" "}
              <a
                href="/request-a-quote"
                className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
              >
                request a quote
              </a>{" "}
              or{" "}
              <a
                href="/book-online"
                className="font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700"
              >
                book online
              </a>
              .
            </p>
          </header>

          <div className="mt-10">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}