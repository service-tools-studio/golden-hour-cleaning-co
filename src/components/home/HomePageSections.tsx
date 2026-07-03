"use client";

import GoogleMapsProvider from "@/components/residential/GoogleMapsProvider";
import GoogleReviews from "@/components/residential/GoogleReviews";
import ServiceAreaMap from "@/components/residential/ServiceAreaMap";
import Footer from "@/components/residential/Footer";
import BeforeAfterSlider from "./BeforeAfterSlider";
import FinalCtaSection from "./FinalCtaSection";
import LifestyleSection from "./LifestyleSection";
import MeetFoundersSection from "./MeetFoundersSection";
import ServicesPreviewSection from "./ServicesPreviewSection";
import WhyChooseSection from "./WhyChooseSection";

export default function HomePageSections() {
  return (
    <>
      <WhyChooseSection />
      <LifestyleSection />
      <ServicesPreviewSection />
      <MeetFoundersSection />
      <GoogleReviews />
      <BeforeAfterSlider />
      <GoogleMapsProvider>
        <ServiceAreaMap title="Areas We Serve" />
      </GoogleMapsProvider>
      <FinalCtaSection />
      <Footer />
    </>
  );
}
