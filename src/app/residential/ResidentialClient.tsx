'use client';
import { useState } from 'react';
import Header from '../../components/residential/Header.jsx'
import Hero from '../../components/residential/Hero.jsx'
import Services from '../../components/residential/Services.jsx'
import QuoteCalculator from '../../components/residential/QuoteCalculator.jsx'
import Footer from '../../components/residential/Footer.jsx'
import Trust from '../../components/residential/Trust.jsx'
import GoogleMapsProvider from '../../components/residential/GoogleMapsProvider.jsx'
import ServiceAreaMap from '../../components/residential/ServiceAreaMap.jsx'
import GoogleReviews from '../../components/residential/GoogleReviews.jsx'
import { BadgeCheck, CalendarCheck2, Leaf, ShieldCheck, Stars } from 'lucide-react'
import { Badge } from '../../helpers/ui-elements.jsx'
export default function ResidentialClient() {
  const [showCalendly, setShowCalendly] = useState(false)

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
          <Trust />
          <ServiceAreaMap />
        </GoogleMapsProvider>


        <div className="pt-10" id="quote">
          <QuoteCalculator
            showCalendly={showCalendly}
            setShowCalendly={setShowCalendly}
            title="Get a Quote"
            subtitle="Transparent, size-based pricing with thoughtful attention to your unique home."
          />
        </div>

        <Services />
      </main>

      <Footer />
    </div>
  );
}
