"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CITY_LANDING_PAGES } from "@/data/cityLandingPages";
import FooterNavLink from "./FooterNavLink";

export default function FooterCitiesMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    if (!open || !menuRef.current) return;

    const frame = requestAnimationFrame(() => {
      menuRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <li ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm"
      >
        Portland-Metro Cities
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          ref={menuRef}
          id={menuId}
          className="mt-2 space-y-1 rounded-xl border border-amber-200 bg-white p-3 shadow-sm"
        >
          {CITY_LANDING_PAGES.map(({ label, href }) => (
            <li key={href}>
              <FooterNavLink
                href={href}
                className="block rounded-md px-2 py-1.5 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                onNavigate={() => setOpen(false)}
              >
                {label}
              </FooterNavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
