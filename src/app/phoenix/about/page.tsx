import type { Metadata } from "next";
import AboutBlogCTA from "@/components/residential/AboutBlogCTA";
import AboutPageContentPhoenix from "@/components/residential/AboutPageContentPhoenix";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import { MARKETS } from "@/lib/markets";

export const metadata: Metadata = {
  title: "About Golden Hour Cleaning Co. | Phoenix House Cleaners",
  description:
    "Meet Kelsey Collins and Jasmin Heart, co-founders of Golden Hour Cleaning Co. — professional house cleaning in Phoenix, Scottsdale, Tempe, Paradise Valley, and surrounding Arizona communities.",
  alternates: { canonical: "/phoenix/about" },
};

export default function PhoenixAboutPage() {
  return (
    <>
      <ServicesPageHeader homeHref={MARKETS.phoenix.path} />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <AboutPageContentPhoenix />
        </article>

        <AboutBlogCTA />

        <Footer market={MARKETS.phoenix} />
      </main>
    </>
  );
}
