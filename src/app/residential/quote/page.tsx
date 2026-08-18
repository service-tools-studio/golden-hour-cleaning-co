'use client';
import { motion } from "framer-motion";
import { CalendarCheck2, BadgeCheck, ShieldCheck, Leaf, Stars } from "lucide-react";
import Trust from '@/components/residential/Trust.jsx';
import { scrollToQuote } from '@/helpers/scrollToQuote.js';
import { Step, Badge } from '@/helpers/ui-elements.jsx'
import Footer from '@/components/residential/Footer.jsx';
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  BOOKING_HEADER_BAND,
  QuoteCalculatorBookingHeader,
} from "@/components/residential/QuoteCalculator";

const QuoteCalculator = dynamic(
  () => import("@/components/residential/QuoteCalculator"),
  { ssr: false }
);

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900">
      <main id="content" className="min-h-screen bg-amber-50 text-stone-900">
        {/* HERO + calculator intro — one full-bleed band */}
        <section className={`${BOOKING_HEADER_BAND} pb-10`}>
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
          <div className="mx-auto max-w-3xl px-4 mt-8">
            <QuoteCalculatorBookingHeader title="Instant Quote & Booking" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pt-16 pb-16">
          <QuoteCalculator title="Instant Quote & Booking" hideHeader />
        </section>

        <Footer />
      </main>
    </div>
  );
}
