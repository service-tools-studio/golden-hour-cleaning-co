import Link from "next/link";

type InternalBreadcrumbsProps = {
  currentPage: string;
};

export default function InternalBreadcrumbs({
  currentPage,
}: InternalBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-600">
        <li>
          <Link
            href="/internal"
            className="font-semibold text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
          >
            Tools
          </Link>
        </li>
        <li aria-hidden className="text-stone-400">
          /
        </li>
        <li
          aria-current="page"
          className="font-semibold text-stone-900"
        >
          {currentPage}
        </li>
      </ol>
    </nav>
  );
}
