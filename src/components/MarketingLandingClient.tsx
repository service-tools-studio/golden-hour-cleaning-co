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
    src: "/assets/stove-hood.jpg",
    alt: "A Golden Hour cleaner wiping the underside of a stainless steel stove hood",
  },
  {
    src: "/assets/vacuuming.PNG",
    alt: "A Golden Hour cleaner smiling while vacuuming a living room rug",
    imageClassName: "object-[22%_center]",
  },
  {
    src: "/assets/shutters.PNG",
    alt: "A Golden Hour cleaner wiping white interior shutters by a sunlit window",
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
          className="border-t border-amber-200/60 bg-white py-12 md:py-16"
          aria-label="Golden Hour cleaners at work"
        >
          <div className="mx-auto max-w-5xl px-4 lg:max-w-6xl">
            <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6">
              {DETAIL_PHOTOS.map((photo) => (
                <figure
                  key={photo.src}
                  className="block w-full max-w-sm overflow-hidden rounded-2xl border border-amber-200 bg-stone-100 shadow-sm lg:max-w-none"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1086}
                    height={1448}
                    sizes="(max-width: 1024px) 24rem, 24rem"
                    className={`aspect-[3/4] h-auto w-full object-cover ${
                      "imageClassName" in photo ? photo.imageClassName : ""
                    }`}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
