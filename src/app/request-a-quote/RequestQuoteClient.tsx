"use client";

import { useState } from "react";
import CleaningLeadForm from "@/components/residential/CleaningLeadForm";
import { HEADING_UPPER } from "@/helpers/typography.js";

export default function RequestQuoteClient() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {!submitted ? (
        <header className="mx-auto max-w-2xl text-center">
          <h1
            className={`text-3xl leading-tight text-stone-900 md:text-4xl ${HEADING_UPPER}`}
          >
            Request a personalized quote
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 md:text-lg">
            Share a few details about your home and we&apos;ll help you find the
            right clean and price. We won&apos;t keep you waiting — we typically
            respond within 1–2 business hours.
          </p>
        </header>
      ) : null}

      <div className={submitted ? undefined : "mt-10"}>
        <CleaningLeadForm
          mode="quote"
          onSuccess={() => setSubmitted(true)}
        />
      </div>
    </>
  );
}
