"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useMarketContact } from "@/helpers/useMarketContact";
import { useMarketAboutHref } from "@/helpers/useMarketAboutHref";
import { useServicesHubHref } from "@/helpers/useServicesHubHref";
import {
  subscribeLeadWizardInView,
} from "../../helpers/leadWizardVisibility";
import { BTN_PRIMARY, BTN_SECONDARY, BTN_UPPER } from "../../helpers/typography.js";

const STATIC_NAV_LINKS_AFTER_ABOUT = [
  { label: "Reviews", href: "/reviews" },
  { label: "Our Guarantee", href: "/satisfaction-guarantee" },
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "Reserve Your Cleaning", href: "/book-online" },
];

const linkClass = `${BTN_UPPER} text-sm font-semibold text-slate-900 underline-offset-4 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-sm`;
const callNowClass = `${BTN_PRIMARY} ml-4 gap-1.5 whitespace-nowrap`;
const mobileMenuPrimaryCtaClass = `${BTN_PRIMARY} w-full`;
const mobileMenuSecondaryCtaClass = `${BTN_SECONDARY} w-full`;
const mobileMenuCallClass = `${BTN_PRIMARY} w-full gap-2`;

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

export default function HeaderNav({ hamburgerOverlay = false } = {}) {
  const contact = useMarketContact();
  const servicesHref = useServicesHubHref();
  const aboutHref = useMarketAboutHref();
  const navLinks = [
    { label: "Services & Pricing", href: servicesHref },
    ...STATIC_NAV_LINKS_AFTER_ABOUT.slice(0, 2),
    { label: "About Us", href: aboutHref },
    ...STATIC_NAV_LINKS_AFTER_ABOUT.slice(2),
  ];
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuTop, setMenuTop] = useState(100);
  const [wizardInView, setWizardInView] = useState(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => subscribeLeadWizardInView(setWizardInView), []);

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
                {navLinks.map((link) => {
                  const isPrimaryCta = link.href === "/request-a-quote";
                  const isSecondaryCta = link.href === "/book-online";
                  const isCta = isPrimaryCta || isSecondaryCta;
                  const replaceWithCall =
                    (isPrimaryCta && wizardInView === "quote") ||
                    (isSecondaryCta && wizardInView === "booking");

                  if (replaceWithCall) {
                    return (
                      <li key={link.href} className="mt-2">
                        <a
                          href={`tel:${contact.phoneE164}`}
                          className={mobileMenuCallClass}
                          aria-label={`Call us at ${contact.phoneDisplay}`}
                          data-call-source="header_nav_mobile_menu_call_wizard"
                          onClick={closeMenu}
                        >
                          <Phone className="h-4 w-4 shrink-0" aria-hidden />
                          Call {contact.phoneDisplay}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href} className={isCta ? "mt-2" : undefined}>
                      <Link
                        href={link.href}
                        className={
                          isPrimaryCta
                            ? mobileMenuPrimaryCtaClass
                            : isSecondaryCta
                              ? mobileMenuSecondaryCtaClass
                              : `${linkClass} block rounded-xl px-3 py-3 hover:bg-amber-100/80`
                        }
                        onClick={closeMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                {!wizardInView ? (
                  <li>
                    <a
                      href={`tel:${contact.phoneE164}`}
                      className={`${linkClass} block rounded-xl px-3 py-3 hover:bg-amber-100/80`}
                      aria-label={`Call us at ${contact.phoneDisplay}`}
                      data-call-source="header_nav_mobile_menu_call"
                      onClick={closeMenu}
                    >
                      Call Us {contact.phoneDisplay}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <nav
      aria-label="Main navigation"
      className={hamburgerOverlay ? "shrink-0" : "relative shrink-0"}
    >
      <ul className="hidden xl:flex items-center">
        {navLinks.map((link, index) => (
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
            href={`tel:${contact.phoneE164}`}
            className={callNowClass}
            aria-label={`Call us at ${contact.phoneDisplay}`}
            data-call-source="header_nav_call_now"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {contact.phoneDisplay}
          </a>
        </li>
      </ul>

      {/* In-flow spacer keeps nav row height when the button is absolutely overlaid */}
      {hamburgerOverlay ? (
        <div className="h-10 w-10 xl:hidden" aria-hidden />
      ) : null}

      {/* Overlay mode: same vertical span as logo (top-1 / bottom-1) so it floats over marquee + nav */}
      <div
        className={
          hamburgerOverlay
            ? "absolute right-3 top-1 bottom-1 z-30 flex items-center sm:right-4 lg:right-6 xl:hidden"
            : "xl:hidden"
        }
      >
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
    </nav>
  );
}
