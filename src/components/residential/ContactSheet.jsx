"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import {
  formatCurrency,
  buildMailto,
  buildSmsLink,
  formatPhone,
} from "../../helpers/contactHelpers";
import { LEVEL_COPY } from "../../constants.js";
import { BTN_SECONDARY } from "../../helpers/typography.js";

/**
 * @typedef {object} ContactSheetContext
 * @property {string} level
 * @property {number} [sqftLow]
 * @property {number} [sqftHigh]
 * @property {number} [sqftInput]
 * @property {number} bedrooms
 * @property {number} bathrooms
 * @property {number} [total]
 * @property {number} [totalLow]
 * @property {boolean} [ecoProducts]
 * @property {number} [cleaners]
 * @property {number} [billableHoursLow]
 * @property {number} [billableHours]
 * @property {number} [ratePerSqftLow]
 * @property {number} [ratePerSqftHigh]
 * @property {{ fridge?: boolean, oven?: boolean, secondKitchen?: boolean }} [addons]
 * @property {{ code: string, amount: number } | null} [promo]
 */

/**
 * @type {import("react").ForwardRefExoticComponent<{
 *   phone: string,
 *   sms: string,
 *   email: string,
 *   context: ContactSheetContext,
 *   className?: string,
 *   buttonLabel?: string,
 *   buttonClassName?: string,
 *   onKeyDown?: (e: import("react").KeyboardEvent<HTMLButtonElement>) => void,
 * } & import("react").RefAttributes<HTMLButtonElement>>}
 */
const ContactSheet = forwardRef(function ContactSheet(
  {
    phone,
    sms,
    email,
    context,
    className = "",
    buttonLabel = "Questions? Call / Text / Email",
    buttonClassName,
    onKeyDown,
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const firstActionRef = useRef(null);

  const levelLabel = LEVEL_COPY[context.level]?.name ?? String(context.level);

  const hasSqftRange =
    typeof context.sqftLow === "number" &&
    typeof context.sqftHigh === "number" &&
    context.sqftLow !== context.sqftHigh;

  const homeSizeLine = hasSqftRange
    ? `Home size used for estimate: ${context.sqftLow.toLocaleString()}–${context.sqftHigh.toLocaleString()} sq ft\n`
    : typeof context.sqftHigh === "number"
      ? `Home size used for estimate: ${context.sqftHigh.toLocaleString()} sq ft\n`
      : "";

  const hasPriceRange =
    typeof context.totalLow === "number" &&
    typeof context.total === "number" &&
    context.totalLow !== context.total;

  const priceLine = hasPriceRange
    ? `Estimated total: ${formatCurrency(
      context.totalLow
    )}–${formatCurrency(context.total)}\n`
    : typeof context.total === "number"
      ? `Estimated total: ${formatCurrency(context.total)}\n`
      : "";

  const promoLine = context.promo
    ? `Promo applied: ${context.promo.code} (−${formatCurrency(
      context.promo.amount
    )})\n`
    : "";

  const summary =
    `Hello Golden Hour — I have a question about my quote.\n` +
    `Service: ${levelLabel}\n` +
    `Bedrooms: ${context.bedrooms}\n` +
    `Bathrooms: ${context.bathrooms}\n` +
    homeSizeLine +
    promoLine +
    priceLine +
    `\nMy question: `;

  const smsHref = buildSmsLink({ phone: sms, message: summary });
  const mailHref = buildMailto({
    email,
    subject: `Question about my quote — ${levelLabel}`,
    body: summary,
  });

  // Close on outside click / Esc / scroll
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onScroll = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  // Focus the first action when opening
  useEffect(() => {
    if (open && firstActionRef.current) {
      firstActionRef.current.focus();
    }
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${className}`.trim()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        aria-expanded={open}
        aria-controls="contact-sheet"
        className={buttonClassName ?? `${BTN_SECONDARY} w-full`}
      >
        {buttonLabel}
      </button>

      {open && (
        <div
          id="contact-sheet"
          className="absolute bottom-full mb-2 right-0 z-40 w-72 max-h:[60vh] overflow-auto rounded-xl border border-stone-200 bg-white p-3 shadow-xl sm:w-80
                     md:right-auto md:left-1/2 md:-translate-x-1/2"
        >
          {/* Arrow pointing down toward the button */}
          <div
            aria-hidden
            className="absolute -bottom-2 right-6 h-0 w-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid rgba(255,255,255,0.95)",
              filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.08))",
            }}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-stone-800">Contact us</div>
            <button
              type="button"
              aria-label="Close contact options"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-stone-500 hover:bg-stone-100"
            >
              ✕
            </button>
          </div>

          <p className="mt-1 text-xs text-stone-600">
            We’ll receive your quote details so we can help fast.
          </p>

          <div className="mt-3 space-y-2">
            <a
              ref={firstActionRef}
              href={`tel:${phone}`}
              data-call-source="contact_sheet_call"
              className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-stone-50"
            >
              <div className="min-w-0">
                <div className="text-sm text-stone-800 truncate">
                  Call {formatPhone(phone)}
                </div>
              </div>
              <span className="text-xs text-stone-500 shrink-0">
                Tap to dial
              </span>
            </a>

            <a
              href={smsHref}
              className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-stone-50"
            >
              <div className="min-w-0">
                <div className="text-sm text-stone-800 truncate">Text us</div>
              </div>
              <span className="text-xs text-stone-500 shrink-0">Opens SMS</span>
            </a>

            <a
              href={mailHref}
              className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 hover:bg-stone-50"
            >
              <div className="min-w-0">
                <div className="text-sm text-stone-800">Email</div>
                <div className="text-xs text-stone-700 break-all">
                  {email}
                </div>
              </div>
              <span className="text-xs text-stone-500 shrink-0">Opens email</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
});

export default ContactSheet;
