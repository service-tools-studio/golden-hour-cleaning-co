const FIELD_LABELS = [
  ["type", "Type"],
  ["bed", "Bed"],
  ["ba", "Bath"],
  ["sf_heur", "Square Footage (heuristic)"],
  ["sf_ent", "Square Footage Entered"],
  ["hours_est", "Person-hours"],
  ["onsite", "On-site time"],
  ["cleaners", "Cleaners"],
  ["add", "Add-ons"],
  ["promo", "Promo"],
  ["est_after_promo", "Estimate after promo"],
];

export function extractUtmContent(rawInput) {
  const input = String(rawInput ?? "").trim();
  if (!input) return "";

  try {
    const url = new URL(input);
    const fromQuery =
      url.searchParams.get("utm_content") ||
      url.searchParams.get("UTM_Content") ||
      url.searchParams.get("UTM_CONTENT");
    if (fromQuery) return fromQuery;
  } catch {
    // Not a URL — continue
  }

  const match = input.match(/(?:^|[?&])utm_content=([^&]*)/i);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  if (/^utm_content=/i.test(input)) {
    return input.replace(/^utm_content=/i, "");
  }

  return input;
}

export function parseUtmContent(rawInput) {
  const content = extractUtmContent(rawInput);
  /** @type {Record<string, string>} */
  const values = {};

  for (const part of content.split("~")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) values[key] = value;
  }

  return values;
}

function displayValue(key, value) {
  if (value == null || value === "") return "";
  return value;
}

export function formatUtmContent(rawInput) {
  const values = parseUtmContent(rawInput);
  return FIELD_LABELS.map(
    ([key, label]) => `${label}: ${displayValue(key, values[key])}`
  ).join("\n");
}

export { FIELD_LABELS };
