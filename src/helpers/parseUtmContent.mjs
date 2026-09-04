const CONTENT_FIELD_LABELS = [
  ["lead", "Lead path"],
  ["type", "Type"],
  ["bed", "Bed"],
  ["ba", "Bath"],
  ["sf", "Square footage"],
  ["sf_heur", "Square Footage (heuristic)"],
  ["sf_ent", "Square Footage Entered"],
  ["hours_est", "Person-hours"],
  ["onsite", "On-site time"],
  ["cleaners", "Cleaners"],
  ["add", "Add-ons"],
  ["promo", "Promo"],
  ["est_after_promo", "Estimate after promo"],
  ["cond", "Condition"],
  ["addr", "Address"],
  ["gclid", "Google Click ID"],
  ["gbraid", "Google gbraid"],
  ["wbraid", "Google wbraid"],
  ["ad_content", "Ad content"],
  ["lp", "Landing page"],
  ["ts", "Timestamp"],
];

const TOP_LEVEL_PARAM_LABELS = [
  ["utm_source", "UTM source"],
  ["utm_medium", "UTM medium"],
  ["utm_campaign", "UTM campaign"],
  ["utm_term", "UTM term"],
  ["utm_id", "UTM id"],
  ["utm_content", "UTM content (raw)"],
  ["gclid", "Google Click ID"],
  ["gbraid", "Google gbraid"],
  ["wbraid", "Google wbraid"],
];

/** @deprecated Prefer CONTENT_FIELD_LABELS — kept for older imports. */
export const FIELD_LABELS = CONTENT_FIELD_LABELS;

function humanizeKey(key) {
  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelForContentKey(key) {
  const known = CONTENT_FIELD_LABELS.find(([k]) => k === key);
  return known ? known[1] : humanizeKey(key);
}

function labelForTopLevelKey(key) {
  const known = TOP_LEVEL_PARAM_LABELS.find(([k]) => k === key);
  return known ? known[1] : humanizeKey(key);
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Pull every query param from a URL or query-string fragment.
 * @param {string} rawInput
 * @returns {Record<string, string>}
 */
export function extractUrlParams(rawInput) {
  const input = String(rawInput ?? "").trim();
  if (!input) return {};

  /** @type {Record<string, string>} */
  const params = {};

  try {
    const url = new URL(input);
    for (const [key, value] of url.searchParams.entries()) {
      if (key) params[key] = value;
    }
    return params;
  } catch {
    // Not an absolute URL — try query-string fragment
  }

  const queryStart = input.indexOf("?");
  if (queryStart >= 0) {
    const search = new URLSearchParams(input.slice(queryStart + 1));
    for (const [key, value] of search.entries()) {
      if (key) params[key] = value;
    }
    return params;
  }

  // Query-string paste without "?": utm_source=...&utm_medium=... or utm_content=...
  // Do not treat tilde payloads (type=deep~bed=3) as query strings.
  const looksLikeQuery =
    /(?:^|&)utm_[a-z0-9_]+=/i.test(input) ||
    /(?:^|&)(?:gclid|gbraid|wbraid)=/i.test(input) ||
    (/&/.test(input) && /(?:^|&)[a-z0-9_]+=/i.test(input));

  if (looksLikeQuery) {
    const search = new URLSearchParams(input);
    for (const [key, value] of search.entries()) {
      if (key) params[key] = value;
    }
  }

  return params;
}

/**
 * Extract the nested utm_content payload (tilde-separated key=value pairs).
 * @param {string} rawInput
 * @returns {string}
 */
export function extractUtmContent(rawInput) {
  const input = String(rawInput ?? "").trim();
  if (!input) return "";

  const params = extractUrlParams(input);
  const fromParams =
    params.utm_content || params.UTM_Content || params.UTM_CONTENT;
  if (fromParams) return fromParams;

  const match = input.match(/(?:^|[?&])utm_content=([^&]*)/i);
  if (match) {
    return safeDecode(match[1]);
  }

  if (/^utm_content=/i.test(input)) {
    return input.replace(/^utm_content=/i, "");
  }

  // Bare payload already looks like type=deep~bed=3~...
  if (/=/.test(input) && /~/.test(input) && !/\s/.test(input)) {
    return input;
  }

  // Plain utm_content value pasted alone (no URL)
  if (/^[a-z0-9_]+=/i.test(input) && !input.includes("?")) {
    return input;
  }

  return input;
}

/**
 * Parse tilde-separated key=value pairs from utm_content.
 * @param {string} rawInput
 * @returns {Record<string, string>}
 */
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

/**
 * Parse a Calendly / marketing URL (or pasted payload) into structured parts.
 * @param {string} rawInput
 * @returns {{
 *   topLevel: Record<string, string>,
 *   content: Record<string, string>,
 *   otherParams: Record<string, string>,
 * }}
 */
export function parseCalendlyAttribution(rawInput) {
  const params = extractUrlParams(rawInput);
  /** @type {Record<string, string>} */
  const topLevel = {};
  /** @type {Record<string, string>} */
  const otherParams = {};

  for (const [key, value] of Object.entries(params)) {
    const lower = key.toLowerCase();
    if (
      lower.startsWith("utm_") ||
      lower === "gclid" ||
      lower === "gbraid" ||
      lower === "wbraid"
    ) {
      topLevel[lower] = value;
    } else if (lower !== "month" && lower !== "date") {
      // Skip Calendly calendar UI params; keep anything else useful
      otherParams[key] = value;
    }
  }

  // Also catch bare "utm_source=..." style strings without a full URL
  if (!Object.keys(topLevel).length && !Object.keys(params).length) {
    const input = String(rawInput ?? "").trim();
    if (/(?:^|[?&])utm_/i.test(input) || /(?:^|[?&])gclid=/i.test(input)) {
      const search = new URLSearchParams(
        input.includes("?") ? input.slice(input.indexOf("?") + 1) : input,
      );
      for (const [key, value] of search.entries()) {
        const lower = key.toLowerCase();
        if (
          lower.startsWith("utm_") ||
          lower === "gclid" ||
          lower === "gbraid" ||
          lower === "wbraid"
        ) {
          topLevel[lower] = value;
        }
      }
    }
  }

  const content = parseUtmContent(rawInput);

  return { topLevel, content, otherParams };
}

function displayValue(value) {
  if (value == null || value === "") return "";
  return value;
}

/**
 * Human-readable dump of all UTM / click IDs + decoded utm_content fields.
 * @param {string} rawInput
 * @returns {string}
 */
export function formatUtmContent(rawInput) {
  const trimmed = String(rawInput ?? "").trim();
  if (!trimmed) return "";

  const { topLevel, content, otherParams } = parseCalendlyAttribution(trimmed);
  const lines = [];

  const hasTopLevel = Object.keys(topLevel).some(
    (key) => key !== "utm_content" && topLevel[key],
  );

  if (hasTopLevel) {
    lines.push("ATTRIBUTION");
    for (const [key, label] of TOP_LEVEL_PARAM_LABELS) {
      if (key === "utm_content") continue;
      if (topLevel[key]) lines.push(`${label}: ${displayValue(topLevel[key])}`);
    }
    // Any unexpected utm_* keys
    for (const [key, value] of Object.entries(topLevel)) {
      if (
        key === "utm_content" ||
        TOP_LEVEL_PARAM_LABELS.some(([k]) => k === key)
      ) {
        continue;
      }
      if (value) lines.push(`${labelForTopLevelKey(key)}: ${displayValue(value)}`);
    }
  }

  const contentKeys = Object.keys(content);
  if (contentKeys.length) {
    if (lines.length) lines.push("");
    lines.push("QUOTE / BOOKING DETAILS");
    const seen = new Set();
    for (const [key, label] of CONTENT_FIELD_LABELS) {
      if (content[key] == null || content[key] === "") continue;
      lines.push(`${label}: ${displayValue(content[key])}`);
      seen.add(key);
    }
    for (const key of contentKeys) {
      if (seen.has(key)) continue;
      lines.push(`${labelForContentKey(key)}: ${displayValue(content[key])}`);
    }
  }

  const otherEntries = Object.entries(otherParams).filter(
    ([, value]) => value != null && value !== "",
  );
  if (otherEntries.length) {
    if (lines.length) lines.push("");
    lines.push("OTHER PARAMS");
    for (const [key, value] of otherEntries) {
      // Skip invitee prefill fields that are usually noisy, but still show them
      lines.push(`${labelForTopLevelKey(key)}: ${displayValue(value)}`);
    }
  }

  // Fallback: nothing structured found — show decoded utm_content raw or input
  if (!lines.length) {
    const rawContent = extractUtmContent(trimmed);
    return rawContent || trimmed;
  }

  return lines.join("\n");
}

export { CONTENT_FIELD_LABELS, TOP_LEVEL_PARAM_LABELS };
