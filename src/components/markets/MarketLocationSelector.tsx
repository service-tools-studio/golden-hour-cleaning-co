"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { MarketConfig, MarketId } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";
import { writePreferredMarketToStorage } from "@/lib/marketPreference";
import { SECTION_EYEBROW } from "@/helpers/typography.js";

const OPTIONS: { id: MarketId; href: string; label: string }[] = [
  { id: "portland", href: "/", label: MARKETS.portland.displayLabel },
  { id: "phoenix", href: "/phoenix", label: MARKETS.phoenix.displayLabel },
];

type Props = {
  market: MarketConfig;
};

export default function MarketLocationSelector({ market }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = OPTIONS.find((o) => o.id === market.id) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex justify-center">
      <button
        type="button"
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-md text-center ${SECTION_EYEBROW} transition hover:text-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2`}
      >
        <span aria-current="page">{current.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-amber-700 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
          className="absolute left-1/2 top-full z-50 mt-2 min-w-[14rem] -translate-x-1/2 rounded-xl border border-amber-200 bg-white p-2 text-left shadow-lg"
        >
          {OPTIONS.map((option) => {
            const selected =
              pathname === option.href ||
              (option.href === "/" && pathname === "") ||
              (option.href !== "/" && pathname?.startsWith(option.href));
            return (
              <li key={option.id} role="presentation">
                <Link
                  role="option"
                  aria-selected={selected}
                  href={option.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    selected
                      ? "bg-amber-100 text-stone-900"
                      : "text-stone-700 hover:bg-amber-50"
                  }`}
                  onClick={() => {
                    writePreferredMarketToStorage(option.id);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="sr-only" aria-live="polite">
        {open ? "Location menu opened" : ""}
      </div>
    </div>
  );
}
