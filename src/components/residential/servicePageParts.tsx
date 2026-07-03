import type { ReactNode } from "react";
import { HEADING_UPPER } from "@/helpers/typography.js";

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
  children,
}: {
  title: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const Tag = level === 3 ? "h3" : "h2";
  const className =
    level === 3
      ? `mt-6 text-base font-semibold text-stone-900 ${HEADING_UPPER}`
      : `mt-10 text-xl font-semibold text-stone-900 md:text-2xl ${HEADING_UPPER}`;

  return (
    <section>
      <Tag className={className}>{title}</Tag>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-t border-amber-100 pt-4 first:border-t-0 first:pt-0">
      <h3 className={`text-sm font-semibold text-stone-900 ${HEADING_UPPER}`}>
        {question}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">{answer}</p>
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
