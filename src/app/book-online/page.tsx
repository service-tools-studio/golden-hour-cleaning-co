import type { Metadata } from "next";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";
import BookOnlineClient from "./BookOnlineClient";

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
          <BookOnlineClient />
        </div>

        <Footer />
      </main>
    </>
  );
}