"use client";

import { Award, BadgeCheck, ShieldCheck, Stars } from "lucide-react";
import { Badge } from "../../helpers/ui-elements.jsx";
import { scrollToId } from "../../helpers/scrollToId.js";
import { useGooglePlaceSummary } from "../../helpers/useGooglePlaceSummary";

export default function ServiceTrustBar() {
  const { rating } = useGooglePlaceSummary();
  const googleRatingLabel = `★★★★★ ${(rating ?? 5).toFixed(1)} Google Rating`;

  const trustFeatures = [
    { icon: ShieldCheck, title: "Licensed & Insured" },
    { icon: BadgeCheck, title: "Background-Checked" },
    {
      icon: Stars,
      title: googleRatingLabel,
      onClick: () => scrollToId("#reviews", 8),
    },
    { icon: Award, title: "Satisfaction Guarantee" },
  ];

  return (
    <section
      aria-label="Why choose Golden Hour"
      className="mx-auto max-w-6xl px-4 pt-10 pb-2"
    >
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {trustFeatures.map(({ icon: Icon, title, onClick }) => (
          <li key={title}>
            <Badge icon={<Icon />} label={title} onClick={onClick} />
          </li>
        ))}
      </ul>
    </section>
  );
}
