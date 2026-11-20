"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MarketId } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";
import { SECTION_EYEBROW } from "@/helpers/typography.js";

const OPTIONS: { id: MarketId; label: string }[] = [
  { id: "portland", label: MARKETS.portland.displayLabel },
  { id: "phoenix", label: MARKETS.phoenix.displayLabel },
];

type Props = {
  value: MarketId;
  onChange: (marketId: MarketId) => void;
  className?: string;
  /** Dropdown alignment under the trigger — default centers like the hero. */
  menuAlign?: "center" | "start";
};

/** Same look as hero `MarketLocationSelector`, without navigating away. */
export default function InlineMarketLocationPicker({
  value,
  onChange,
  className = "",
  menuAlign = "center",
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const current = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0];

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
    <div
      className={`${SECTION_EYEBROW} flex items-center justify-center gap-1 text-center ${className}`}
    >
      <span aria-hidden>📍</span>
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
            className={`absolute top-full z-50 mt-2 min-w-[14rem] rounded-xl border border-amber-200 bg-white p-2 text-left shadow-lg ${
              menuAlign === "start"
                ? "left-0"
                : "left-1/2 -translate-x-1/2"
            }`}
          >
            {OPTIONS.map((option) => (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === option.id}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    value === option.id
                      ? "bg-amber-100 text-stone-900"
                      : "text-stone-700 hover:bg-amber-50"
                  }`}
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="sr-only" aria-live="polite">
          {open ? "Location menu opened" : ""}
        </div>
      </div>
    </div>
  );
}