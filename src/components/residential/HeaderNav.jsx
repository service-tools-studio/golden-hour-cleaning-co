"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { CONTACT } from "../../constants.js";
import { SERVICES_PRICING_HREF } from "../../helpers/ctaLabels.js";
import { BTN_PRIMARY, BTN_UPPER } from "../../helpers/typography.js";

const NAV_LINKS = [
  { label: "Services & Pricing", href: SERVICES_PRICING_HREF },
  { label: "Reviews", href: "/reviews" },
  { label: "Our Guarantee", href: "/satisfaction-guarantee" },
  { label: "About Us", href: "/about" },
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "Reserve Your Cleaning", href: "/book-online" },
];

const linkClass = `${BTN_UPPER} text-sm font-semibold text-slate-900 underline-offset-4 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`;
const callNowClass = `${BTN_PRIMARY} ml-4 gap-1.5 whitespace-nowrap`;
const mobileStickyCallClass = `${BTN_PRIMARY} w-full gap-2`;
const mobileMenuCtaClass = `${BTN_PRIMARY} w-full`;

const MOBILE_CALL_BAR_HEIGHT = "72px";

function getSiteHeader() {
  return document.querySelector("[data-site-header]");
}

function getMenuTop() {
  const header = getSiteHeader();
  if (header) return Math.round(header.getBoundingClientRect().bottom);
  const fallback = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  return Number.parseInt(fallback, 10) || 100;
}

export default function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuTop, setMenuTop] = useState(100);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const syncCallBarPadding = () => {
      if (mq.matches) {
        document.documentElement.style.setProperty(
          "--mobile-call-bar-height",
          MOBILE_CALL_BAR_HEIGHT,
        );
        document.body.style.paddingBottom = MOBILE_CALL_BAR_HEIGHT;
      } else {
        document.documentElement.style.removeProperty("--mobile-call-bar-height");
        document.body.style.paddingBottom = "";
      }
    };

    syncCallBarPadding();
    mq.addEventListener("change", syncCallBarPadding);
    return () => {
      mq.removeEventListener("change", syncCallBarPadding);
      document.documentElement.style.removeProperty("--mobile-call-bar-height");
      document.body.style.paddingBottom = "";
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const syncMenuTop = () => {
      setMenuTop(getMenuTop());
    };

    syncMenuTop();
    window.addEventListener("resize", syncMenuTop);
    window.addEventListener("scroll", syncMenuTop, { passive: true });
    return () => {
      window.removeEventListener("resize", syncMenuTop);
      window.removeEventListener("scroll", syncMenuTop);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    setOpen((value) => {
      if (!value) setMenuTop(getMenuTop());
      return !value;
    });
  }

  const mobileMenu =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close menu"
              className="fixed inset-x-0 bottom-0 z-[100001] bg-black/25 xl:hidden"
              style={{ top: menuTop }}
              onClick={closeMenu}
            />
            <div
              id={menuId}
              className="fixed inset-x-0 z-[100002] border-b border-amber-200 bg-amber-50 shadow-lg xl:hidden"
              style={{ top: menuTop }}
            >
              <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
                {NAV_LINKS.map((link) => {
                  const isCta =
                    link.href === "/request-a-quote" ||
                    link.href === "/book-online";
                  return (
                    <li key={link.href} className={isCta ? "mt-2" : undefined}>
                      <Link
                        href={link.href}
                        className={
                          isCta
                            ? mobileMenuCtaClass
                            : `${linkClass} block rounded-xl px-3 py-3 hover:bg-amber-100/80`
                        }
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>,
          document.body,
        )
      : null;

  const mobileStickyCall = mounted
      ? createPortal(
          <div className="fixed inset-x-0 bottom-0 z-[100003] border-t border-amber-200 bg-amber-50/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm xl:hidden">
            <a
              href={`tel:${CONTACT.phone}`}
              className={mobileStickyCallClass}
              aria-label="Call us"
              data-call-source="header_nav_mobile_call_now"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              Call Us
            </a>
          </div>,
          document.body,
        )
      : null;

  return (
    <nav aria-label="Main navigation" className="relative shrink-0">
      <ul className="hidden xl:flex items-center">
        {NAV_LINKS.map((link, index) => (
          <li key={link.href} className="flex items-center">
            {index > 0 ? (
              <span className="px-2.5 text-slate-500 select-none" aria-hidden>
                ·
              </span>
            ) : null}
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center">
          <a
            href={`tel:${CONTACT.phone}`}
            className={callNowClass}
            aria-label="Call us"
            data-call-source="header_nav_call_now"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Call Us
          </a>
        </li>
      </ul>

      <div className="xl:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/80 bg-amber-50/90 text-slate-900 shadow-sm hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {mobileMenu}
      {mobileStickyCall}
    </nav>
  );
}
