export function buildCalendlyUrlWithUtm(baseUrl, result, promo = {}) {
  // Build timestamp (local)
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ts = `${mm}-${dd}-${yy}|${hh}:${min}`;

  // Validate + parse URL safely
  let u;
  try {
    u = new URL(baseUrl);
  } catch (err) {
    // If baseUrl is somehow not absolute, fail loudly in dev
    console.error("Invalid Calendly baseUrl:", baseUrl, err);
    return baseUrl;
  }

  // Add-ons compact code
  const addons =
    [
      result?.addonFridge ? "Fr" : "",
      result?.addonOven ? "Ov" : "",
      result?.addonSecondKitchen ? "2Kit" : "",
    ].filter(Boolean).join("") || "none";

  // Promo
  const promoApplied = Boolean(promo?.applied);
  const promoCode = promoApplied && promo?.code ? String(promo.code) : "none";

  // Build utm_content (kept as one string)
  const contentParts = [
    `type=${result?.cleanType ?? "unknown"}`,
    `bed=${result?.bedrooms ?? ""}`,
    `ba=${result?.bathrooms ?? ""}`,
    `sf_heur=${result?.estSqft ?? ""}`,
    `sf_ent=${result?.sqftInput ?? ""}`,
    `sf_low=${result?.sqftLow ?? ""}`,
    `sf_high=${result?.sqftHigh ?? ""}`,
    `hours_est=${result?.billableHoursLow ?? ""}-${result?.billableHoursHigh ?? result?.billableHours ?? ""}`,
    `freq=${result?.frequency ?? ""}`,
    `use_eco=${result?.ecoProducts ? "yes" : "no"}`,
    `add=${addons}`,
    `promo=${promoCode}`,
    `est_after_promo=${result?.totalAfterPromoLow ?? ""}-${result?.totalAfterPromoHigh ?? result?.totalAfterPromo ?? ""}`,
    `ts=${ts}`,
  ].join("~");

  // Set (overwrite) UTM params without nuking existing query params like ?month=...
  u.searchParams.set("utm_source", "quote_calculator");
  u.searchParams.set("utm_medium", "website");
  u.searchParams.set("utm_campaign", "cleaning_quote");
  u.searchParams.set("utm_content", contentParts);

  return u.toString();
}
