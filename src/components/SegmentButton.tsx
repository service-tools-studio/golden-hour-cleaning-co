import Link from "next/link";

type Props = {
  href: string;
  title: string;
  description: string;
};

export default function SegmentButton({ href, title, description }: Props) {
  return (
    <Link
      href={href}
      className="group w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-stone-400"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
            Enter {title}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </div>

        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-stone-50 text-stone-700 sm:flex">
          ↗
        </div>
      </div>
    </Link>
  );
}
