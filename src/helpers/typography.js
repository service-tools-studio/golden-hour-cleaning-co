/** Site uses Josefin Sans throughout. */
export const HEADING_UPPER = "uppercase tracking-wide";
export const QUOTE_SECTION_LABEL =
  "text-sm font-semibold uppercase tracking-[0.14em] text-stone-900";
export const QUOTE_FIELD_LABEL =
  "text-xs font-medium uppercase tracking-[0.12em] text-stone-500";
export const BTN_UPPER = "uppercase tracking-wide";

/** Shared section rhythm for marketing landings (homepage-first). */
export const SECTION_PAD = "py-14 md:py-16";

export const SECTION_HEADING = `text-center text-3xl font-semibold text-stone-900 sm:text-4xl ${HEADING_UPPER}`;

/** Gold/amber section eyebrow — use instead of custom tracking + hex gold. */
export const SECTION_EYEBROW =
  "text-sm font-semibold uppercase tracking-wide text-amber-700";

export const SECTION_EYEBROW_ON_DARK =
  "text-sm font-semibold uppercase tracking-wide text-amber-200";

/** Primary amber CTA — use for main conversion actions. */
export const BTN_PRIMARY = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-amber-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.98]`;

/**
 * Primary CTA that stays quiet on small screens (white) and goes amber at lg+.
 * Used where a gold button sits on a light stacked hero.
 */
export const BTN_PRIMARY_RESPONSIVE = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.98] lg:border-amber-300 lg:bg-amber-400 lg:text-slate-900 lg:shadow-md lg:hover:bg-amber-300 lg:hover:shadow-lg`;

/** Secondary outline CTA — white surface, stone border. */
export const BTN_SECONDARY = `${BTN_UPPER} inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.98]`;
