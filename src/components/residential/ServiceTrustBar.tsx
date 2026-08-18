"use client";

import {
  BadgeCheck,
  CalendarCheck2,
  ShieldCheck,
  Stars,
} from "lucide-react";
import { Badge } from "../../helpers/ui-elements.jsx";
import { scrollToId } from "../../helpers/scrollToId.js";

const TRUST_FEATURES = [
  { icon: ShieldCheck, title: "Licensed & Insured" },
  { icon: BadgeCheck, title: "Background-Checked" },
  {
    icon: Stars,
    title: "★★★★★ 5.0 Google Rating",
    onClick: () => scrollToId("#reviews", 8),
  },
  { icon: CalendarCheck2, title: "Easy Online Booking" },
];

export default function ServiceTrustBar() {
  return (
    <section
      aria-label="Why choose Golden Hour"
      className="mx-auto max-w-6xl px-4 pt-10 pb-2"
    >
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TRUST_FEATURES.map(({ icon: Icon, title, onClick }) => (
          <li key={title}>
            <Badge icon={<Icon />} label={title} onClick={onClick} />
          </li>
        ))}
      </ul>
    </section>
  );
}
