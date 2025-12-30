'use client';
import { useState } from 'react';
import Header from '../../components/shared/Header.jsx'
import Hero from '../../components/residential/Hero.jsx'
import Services from '../../components/residential/Services.jsx'
import QuoteCalculator from '../../components/residential/QuoteCalculator.jsx'
import Footer from '../../components/residential/Footer.jsx'
import Trust from '../../components/residential/Trust.jsx'
import { BadgeCheck, CalendarCheck2, Leaf, ShieldCheck, Stars } from 'lucide-react'
import { Badge } from '../../helpers/ui-elements.jsx'
import InstantQuoteButton from '../../components/residential/InstantQuoteButton.jsx'

export default function ResidentialClient() {
  const [showCalendly, setShowCalendly] = useState(false)

  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 relative">
      {!showCalendly && <Header />}
      {!showCalendly && <InstantQuoteButton />}

      <main
        id="content"
        className="overflow-x-hidden"
        style={{ scrollPaddingTop: 'var(--header-height, 120px)' }}
      >
        <Hero />
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid w-full max-w-xl grid-cols-2 gap-3 text-sm text-stone-700 sm:grid-cols-4">
            <Badge icon={<ShieldCheck />} label="Licensed & Insured" />
            <Badge icon={<BadgeCheck />} label="Background-Checked Professionals" />
            <Badge icon={<CalendarCheck2 />} label="Real-Time Booking" />
            <Badge icon={<Stars />} label="5-Star Experience" />
          </div>
        </div>

        <Trust />

        <div className="pt-10">
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
