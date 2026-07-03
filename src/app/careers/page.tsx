import type { Metadata } from "next";
import CareersPageContent from "@/components/residential/CareersPageContent";
import Footer from "@/components/residential/Footer";
import ServicesPageHeader from "@/components/residential/ServicesPageHeader";

export const metadata: Metadata = {
  title: "Careers | Golden Hour Cleaning Co.",
  description:
    "Join Golden Hour Cleaning Co. as an independent cleaning contractor in the Portland metro area. Flexible scheduling, competitive pay, and a supportive team.",
};

export default function CareersPage() {
  return (
    <>
      <ServicesPageHeader showCtas={false} />

      <main className="min-h-screen bg-amber-50 text-stone-900">
        <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <CareersPageContent />
        </article>

        <Footer />
      </main>
    </>
  );
}
