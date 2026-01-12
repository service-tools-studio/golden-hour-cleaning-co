'use client';
import { useState } from 'react';
import { motion } from "framer-motion";
import { CalendarCheck2, BadgeCheck, ShieldCheck, Leaf, Stars } from "lucide-react";
import Trust from '@/components/residential/Trust.jsx';
import { scrollToQuote } from '@/helpers/scrollToQuote.js';
import { Step, Badge } from '@/helpers/ui-elements.jsx'
import Footer from '@/components/residential/Footer.jsx';
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const QuoteCalculator = dynamic(
  () => import("@/components/residential/QuoteCalculator"),
  { ssr: false }
);

export default function QuotePage() {
  const [showCalendly, setShowCalendly] = useState(false);
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-6">
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
      </section>

      {/* QUOTE CALCULATOR MOUNT (placeholder) */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <QuoteCalculator showCalendly={showCalendly} setShowCalendly={setShowCalendly} title="Instant Quote & Booking" subtitle="Start below to see your price and reserve an exact time on our calendar." />
      </section>

      <Footer />
    </div>
  );
}
