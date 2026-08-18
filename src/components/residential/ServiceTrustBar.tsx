import {
  CalendarCheck2,
  Leaf,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    description: "Your home is in trusted hands.",
  },
  {
    icon: UserCircle,
    title: "Background-Checked",
    description: "We care who we send to your home.",
  },
  {
    icon: Leaf,
    title: "Thoughtful Products",
    description: "We use eco-friendly products whenever possible.",
  },
  {
    icon: CalendarCheck2,
    title: "Easy Online Booking",
    description: "Instant quotes and real-time availability – all online.",
  },
];

export default function ServiceTrustBar() {
  return (
    <section
      aria-label="Why choose Golden Hour"
      className="mx-auto max-w-6xl px-4 pb-4"
    >
      <div className="overflow-hidden rounded-2xl border border-[#a7eff1]/90 bg-[#f5fcfc] shadow-sm">
        <ul className="grid divide-x divide-y divide-[#a7eff1]/70 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3 px-5 py-6 sm:px-6 sm:py-7">
              <Icon
                className="mt-0.5 h-8 w-8 shrink-0 text-teal-700"
                strokeWidth={1.5}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug text-stone-900">
                  {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
