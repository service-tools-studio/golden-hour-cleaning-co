"use client";

import { scrollToId } from "@/helpers/scrollToId";

const LINK_CLASS =
  "font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-700";

const LINK_TEXT = "review starting prices";

/** FAQ answer with an in-page link to the Starting Prices section. */
export default function ReviewStartingPricesFaqAnswer({
  answer,
  pricingHref = "#pricing",
}: {
  answer: string;
  pricingHref?: string;
}) {
  const idx = answer.indexOf(LINK_TEXT);
  if (idx === -1) {
    return <>{answer}</>;
  }

  const before = answer.slice(0, idx);
  const after = answer.slice(idx + LINK_TEXT.length);

  return (
    <>
      {before}
      <a
        href={pricingHref}
        className={LINK_CLASS}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(pricingHref, 8, { focus: true });
        }}
      >
        {LINK_TEXT}
      </a>
      {after}
    </>
  );
}
