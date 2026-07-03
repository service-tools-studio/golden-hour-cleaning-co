import type { Metadata } from "next";
import AboutPageContent from "@/components/residential/AboutPageContent";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "About Us | Golden Hour Cleaning Co.",
  description:
    "Meet Kelsey Collins and Jasmin Heart, co-founders of Golden Hour Cleaning Co. — professional residential and commercial cleaning throughout the Portland metro area.",
};

export default function AboutPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services#quote" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <AboutPageContent />
        </article>

        <Footer />
      </main>
    </>
  );
}
