'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { scrollToId } from '../../helpers/scrollToId';
import Header from '../../components/residential/Header.jsx'
import Hero from '../../components/residential/Hero.jsx'
import Services from '../../components/residential/Services.jsx'
import BeforeAfter from '../../components/residential/BeforeAfter.jsx'
import QuoteCalculator from '../../components/residential/QuoteCalculator.jsx'
import Footer from '../../components/residential/Footer.jsx'
import ClientExperienceSection from '../../components/residential/ClientExperienceSection'
import GoogleMapsProvider from '../../components/residential/GoogleMapsProvider.jsx'
import ServiceAreaMap from '../../components/residential/ServiceAreaMap.jsx'
import GoogleReviews from '../../components/residential/GoogleReviews.jsx'
import { BadgeCheck, CalendarCheck2, Leaf, ShieldCheck, Stars } from 'lucide-react'
import { Badge } from '../../helpers/ui-elements.jsx'

const VALID_LEVELS = new Set(["standard", "deep", "move_out"]);
type Level = "standard" | "deep" | "move_out";

function levelFromUrl(value: string | null): Level {
  if (value && VALID_LEVELS.has(value as Level)) return value as Level;
  return "deep";
}

export default function ResidentialClient() {
  const searchParams = useSearchParams();
  const initialLevel = levelFromUrl(searchParams.get("level"));
  const [showCalendly, setShowCalendly] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#quote") {
      scrollToId("#quote", 8, { focus: true });
    }
  }, [initialLevel]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      {!showCalendly && <Header />}

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: 'var(--header-height, 120px)' }}
      >
        <Hero />
        <div className="mx-auto flex min-h-[8rem] max-w-7xl flex-col items-center justify-center px-6 pt-5">
          <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-3 text-sm text-stone-700 sm:grid-cols-4">
            <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
            <Badge icon={<BadgeCheck />} label="Background-Checked" />
            <Badge icon={<CalendarCheck2 />} label="Real-Time Booking" />
            <Badge icon={<Stars />} label="5-Star Experience" />
          </div>
        </div>

        <GoogleMapsProvider>
          <GoogleReviews />
          <ClientExperienceSection />
          <ServiceAreaMap />
        </GoogleMapsProvider>


        <Services />

        <BeforeAfter />

        <div className="pt-10" id="quote">
          <QuoteCalculator
            showCalendly={showCalendly}
            setShowCalendly={setShowCalendly}
            initialLevel={initialLevel}
            title="Get a Quote & Book Instantly"
            subtitle="Transparent, size-based pricing with thoughtful attention to your unique home."
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
