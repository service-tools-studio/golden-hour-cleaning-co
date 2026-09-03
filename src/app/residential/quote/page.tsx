"use client";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/residential/Footer.jsx";
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main id="content" className="min-h-screen bg-amber-50 text-stone-900">
        <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-6 flex justify-center">
          <Link href="/" aria-label="Go to homepage">
            <Image
              src="/assets/Golden Hour - commercial.png"
              alt="Golden Hour Cleaning Co."
              width={200}
              height={100}
              priority
              className="h-[100px] sm:h-[100px] w-auto cursor-pointer"
              sizes="(max-width: 640px) 260px, 360px"
            />
          </Link>
        </div>

        <section id="quote" className="mx-auto max-w-7xl px-6 pt-8 pb-16 md:pb-20">
          <ResidentialPricingGuide />
        </section>

        <Footer />
      </main>
    </div>
  );
}
