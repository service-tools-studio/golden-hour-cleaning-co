import type { ReactNode } from "react";
import Link from "next/link";
import { HEADING_UPPER } from "@/helpers/typography.js";

export function BackToServicesLink() {
  return (
    <Link
      href="/residential/services"
      className="uppercase tracking-wide mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
    >
      ← See all services
    </Link>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-stone-700">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span aria-hidden className="text-amber-600">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Section({
  title,
  level = 2,
  id,
  children,
}: {
  title: string;
  level?: 2 | 3;
  id?: string;
  children: ReactNode;
}) {
  const Tag = level === 3 ? "h3" : "h2";
  const className =
    level === 3
      ? `mt-6 text-base font-semibold text-stone-900 ${HEADING_UPPER}`
      : `mt-10 text-xl font-semibold text-stone-900 md:text-2xl ${HEADING_UPPER}`;

  return (
    <section id={id} className={id ? "scroll-mt-[var(--header-height,120px)]" : undefined}>
      <Tag className={className}>{title}</Tag>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export const HOURLY_CHARGE_FAQ = {
  question: "What do you charge hourly?",
  answer:
    "We don't charge by the hour. Our pricing is based on the size, condition and scope of your home, so you're paying for the completed cleaning—not how long it takes us to get there.\n\nOur experienced team works efficiently, and we don't believe you should pay more simply because a cleaning takes longer—or that our team's efficiency should make the service worth less. Your quoted price reflects completion of the agreed-upon cleaning scope, regardless of the exact time required.",
};

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const paragraphs = answer.trim().split(/\n\n+/);

  return (
    <div className="border-t border-amber-100 pt-4 first:border-t-0 first:pt-0">
      <h3 className={`text-sm font-semibold text-stone-900 ${HEADING_UPPER}`}>
        {question}
      </h3>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-2 text-sm leading-relaxed text-stone-700">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export const PORTLAND_METRO_AREAS = [
  "Portland",
  "Beaverton",
  "Hillsboro",
  "Tigard",
  "Lake Oswego",
  "Tualatin",
  "West Linn",
  "Oregon City",
  "Happy Valley",
  "Milwaukie",
  "Gresham",
  "Surrounding Portland metro communities",
];
