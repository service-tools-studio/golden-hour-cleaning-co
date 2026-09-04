/** Internal quote calculator only — do not import from public pages. */

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"];

export function buildCalendlyUrlWithUtm(
  baseUrl,
  result,
  promo = {},
  attribution = null
) {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ts = `${mm}-${dd}-${yy}|${hh}:${min}`;

  let u;
  try {
    u = new URL(baseUrl);
  } catch (err) {
    console.error("Invalid Calendly baseUrl:", baseUrl, err);
    return baseUrl;
  }

  const addons =
    [
      result?.addonFridge ? "Fr" : "",
      result?.addonOven ? "Ov" : "",
      result?.addonSecondKitchen ? "2Kit" : "",
    ]
      .filter(Boolean)
      .join("") || "none";

  const promoApplied = Boolean(promo?.applied);
  const promoCode = promoApplied && promo?.code ? String(promo.code) : "none";

  const onSiteLow = result?.time?.onSiteRangeLow ?? "";
  const onSiteHigh = result?.time?.onSiteRangeHigh ?? "";
  const cleaners = result?.time?.cleaners ?? "";

  const contentParts = [
    `type=${result?.cleanType ?? "unknown"}`,
    `bed=${result?.bedrooms ?? ""}`,
    `ba=${result?.bathrooms ?? ""}`,
    `sf_heur=${result?.estSqft ?? ""}`,
    `sf_ent=${result?.sqftInput ?? ""}`,
    `hours_est=${result?.billableHoursLow ?? ""}-${result?.billableHoursHigh ?? result?.billableHours ?? ""}`,
    `onsite=${onSiteLow}-${onSiteHigh}`,
    `cleaners=${cleaners}`,
    `add=${addons}`,
    `promo=${promoCode}`,
    `est_after_promo=${result?.totalAfterPromoLow ?? ""}-${result?.totalAfterPromoHigh ?? result?.totalAfterPromo ?? ""}`,
    `ts=${ts}`,
  ].join("~");

  u.searchParams.set("utm_source", "quote_calculator");
  u.searchParams.set("utm_medium", "website");
  u.searchParams.set("utm_campaign", "cleaning_quote");
  u.searchParams.set("utm_content", contentParts);

  const attrs = attribution && typeof attribution === "object" ? attribution : {};

  for (const key of CLICK_ID_KEYS) {
    const value = attrs?.[key];
    if (value) u.searchParams.set(key, value);
  }

  return u.toString();
}
