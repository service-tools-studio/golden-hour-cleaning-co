"use client";

import Image from "next/image";
import ScrollDepthTracker from "@/components/analytics/ScrollDepthTracker";
import ScrollDebugOverlay from "@/components/ScrollDebugOverlay";
import MeetFoundersSection from "@/components/home/MeetFoundersSection";
import ServicesPreviewSection from "@/components/home/ServicesPreviewSection";
import BeforeAfter from "@/components/residential/BeforeAfter";
import ClientExperienceSection from "@/components/residential/ClientExperienceSection";
import Footer from "@/components/residential/Footer";
import GoogleReviews from "@/components/residential/GoogleReviews";
import Header from "@/components/residential/Header";
import Hero from "@/components/residential/Hero";
import ResidentialPricingGuide from "@/components/residential/ResidentialPricingGuide";
import ServiceAreaMap from "@/components/residential/ServiceAreaMap";

const DETAIL_PHOTOS = [
  {
    src: "/assets/vacuuming.PNG",
    alt: "A Golden Hour cleaner smiling while vacuuming a living room rug",
  },
  {
    src: "/assets/shutters.PNG",
    alt: "A Golden Hour cleaner wiping white plantation shutters by a sunny window",
  },
  {
    src: "/assets/windows.PNG",
    alt: "A Golden Hour cleaner wiping an upper window pane above plantation shutters",
  },
] as const;

type Props = {
  pagePath: "/" | "/residential";
};

export default function MarketingLandingClient({ pagePath }: Props) {
  return (
    <div id="page-top" className="relative min-h-screen bg-amber-50 text-stone-900">
      <ScrollDebugOverlay />
      <ScrollDepthTracker pagePath={pagePath} />
      <Header />

      <main id="content">
        <Hero />

        <GoogleReviews />
        <ClientExperienceSection />
        <ServiceAreaMap />

        <ServicesPreviewSection />

        <MeetFoundersSection />

        <BeforeAfter />

        <div className="pt-14 pb-20 md:pt-16 md:pb-24" id="quote">
          <ResidentialPricingGuide />
        </div>

        <section
          className="border-t border-amber-200/60 bg-white py-16 md:py-20 lg:py-24"
          aria-label="Golden Hour cleaners at work"
        >
          <div className="mx-auto max-w-6xl px-6 lg:max-w-7xl">
            <ul className="grid gap-6 sm:grid-cols-3">
              {DETAIL_PHOTOS.map(({ src, alt }) => (
                <li key={src}>
                  <figure className="overflow-hidden rounded-2xl border border-amber-200 bg-stone-100 shadow-sm">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
