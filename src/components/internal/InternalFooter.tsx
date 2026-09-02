import Image from "next/image";
import Link from "next/link";
import { HEADING_UPPER } from "@/helpers/typography.js";

const MAIN_SITE_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/residential", label: "Residential cleaning" },
  { href: "/residential/services", label: "Services & quote" },
  { href: "/about", label: "About us" },
] as const;

export default function InternalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-amber-200 bg-white text-stone-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:py-10">
        <Link href="/" aria-label="Go to Golden Hour Cleaning Co. homepage">
          <Image
            src="/assets/Golden Hour - commercial.png"
            alt="Golden Hour Cleaning Co."
            width={180}
            height={90}
            className="h-16 w-auto sm:h-[72px]"
            sizes="180px"
          />
        </Link>

        <nav aria-label="Main site">
          <p
            className={`text-xs font-semibold uppercase tracking-wide text-stone-500 ${HEADING_UPPER}`}
          >
            Main site
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {MAIN_SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold text-stone-700 underline-offset-4 hover:text-stone-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-amber-100 bg-amber-50/80 px-6 py-3 text-center text-xs text-stone-600">
        © {year} Golden Hour Cleaning Co. Internal tools.
      </div>
    </footer>
  );
}
