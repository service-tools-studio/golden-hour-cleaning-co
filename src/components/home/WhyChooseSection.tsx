import { CalendarCheck2, Leaf, Sparkles, Star } from "lucide-react";
import { HEADING_UPPER } from "@/helpers/typography.js";

const ITEMS = [
  {
    icon: Sparkles,
    title: "High-Touch Service",
    desc: "We treat every home with care, professionalism, and attention to detail.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Products",
    desc: "Safe, effective products that are tough on dirt and gentle on your home.",
  },
  {
    icon: CalendarCheck2,
    title: "Simple Online Booking",
    desc: "Receive an instant quote and schedule your cleaning online in minutes.",
  },
  {
    icon: Star,
    title: "Consistent Quality",
    desc: "Our cleaning standards are designed to deliver dependable results every visit.",
  },
];

export default function WhyChooseSection() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="border-t border-amber-200/60 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="why-choose-heading"
          className={`text-center text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`}
        >
          Why Choose Golden Hour
        </h2>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-stone-900">
                <Icon className="h-8 w-8" aria-hidden />
              </div>
              <h3 className={`mt-5 text-lg font-semibold text-stone-900 ${HEADING_UPPER}`}>
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
