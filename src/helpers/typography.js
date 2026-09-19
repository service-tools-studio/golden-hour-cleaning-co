/** Site uses Josefin Sans throughout. */
export const HEADING_UPPER = "uppercase tracking-wide";
export const QUOTE_SECTION_LABEL =
  "text-sm font-semibold uppercase tracking-[0.14em] text-stone-900";
export const QUOTE_FIELD_LABEL =
  "text-xs font-medium uppercase tracking-[0.12em] text-stone-500";
export const BTN_UPPER = "uppercase tracking-wide";

/**
 * Shared section rhythm for marketing landings.
 * Slightly airier than before so desktop still breathes after the root font-size scale-down.
 */
export const SECTION_PAD = "py-16 md:py-20 lg:py-24";

/** Standard content column — a touch wider on large screens so smaller type uses the viewport. */
export const SECTION_INNER = "mx-auto max-w-6xl px-6 lg:max-w-7xl";

export const SECTION_HEADING = `text-center text-2xl font-semibold text-stone-900 sm:text-3xl ${HEADING_UPPER}`;

/** Gold/amber section eyebrow — use instead of custom tracking + hex gold. */
export const SECTION_EYEBROW =
  "text-sm font-semibold uppercase tracking-wide text-amber-700";

export const SECTION_EYEBROW_ON_DARK =
  "text-sm font-semibold uppercase tracking-wide text-amber-200";

const BTN_BASE = `${BTN_UPPER} inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-[0.98] sm:min-h-0`;

/** Primary amber CTA — use for main conversion actions. */
export const BTN_PRIMARY = `${BTN_BASE} border-amber-300 bg-amber-400 text-slate-900 shadow-md hover:bg-amber-300 hover:shadow-lg`;

/**
 * Primary CTA that stays quiet on small screens (white) and goes amber at lg+.
 * Used where a gold button sits on a light stacked hero.
 */
export const BTN_PRIMARY_RESPONSIVE = `${BTN_BASE} border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50 lg:border-amber-300 lg:bg-amber-400 lg:text-slate-900 lg:shadow-md lg:hover:bg-amber-300 lg:hover:shadow-lg`;

/** Secondary outline CTA — white surface, stone border. */
export const BTN_SECONDARY = `${BTN_BASE} border-stone-300 bg-white text-stone-900 shadow-sm hover:bg-stone-50`;
