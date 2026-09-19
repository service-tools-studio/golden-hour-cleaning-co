import type { Metadata } from "next";
import AboutBlogCTA from "@/components/residential/AboutBlogCTA";
import AboutPageContent from "@/components/residential/AboutPageContent";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "About Golden Hour Cleaning Co. | Portland House Cleaners",
  description:
    "Meet Kelsey Collins and Jasmin Heart, co-founders of Golden Hour Cleaning Co. — a locally owned house cleaning company serving Portland, Oregon and the surrounding metro area.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <ServicesPageHeader quoteHref="/residential/services" />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <AboutPageContent />
        </article>

        <AboutBlogCTA />

        <Footer />
      </main>
    </>
  );
}
