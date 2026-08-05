#!/usr/bin/env node

/**
 * Parse Golden Hour quote calculator utm_content values.
 *
 * Usage:
 *   npm run parse-utm -- 'UTM_Content=type=deep~bed=3~ba=1.5~...'
 */

const FIELD_LABELS = [
  ["type", "Type"],
  ["bed", "Bed"],
  ["ba", "Bath"],
  ["sf_heur", "Square Footage (heuristic)"],
  ["sf_ent", "Square Footage Entered"],
  ["hours_est", "Hours"],
  ["use_eco", "Use eco"],
  ["promo", "Promo"],
  ["est_after_promo", "Estimate after promo"],
];

function extractUtmContent(rawInput) {
  const input = String(rawInput ?? "").trim();
  if (!input) return "";

  // Full URL with query params
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

  // Query-string fragment: utm_content=... or UTM_Content=...
  const match = input.match(/(?:^|[?&])utm_content=([^&]*)/i);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  // Prefixed: UTM_Content=type=deep~bed=3...
  if (/^utm_content=/i.test(input)) {
    return input.replace(/^utm_content=/i, "");
  }

  // Raw content payload already: type=deep~bed=3...
  return input;
}

function parseUtmContent(rawInput) {
  const content = extractUtmContent(rawInput);
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

function formatOutput(values) {
  return FIELD_LABELS.map(
    ([key, label]) => `${label}: ${values[key] ?? ""}`
  ).join("\n");
}

async function readStdin() {
  if (process.stdin.isTTY) return "";

  let data = "";
  for await (const chunk of process.stdin) {
    data += chunk;
  }
  return data.trim();
}

async function main() {
  const arg = process.argv.slice(2).join(" ").trim();
  const input = arg || (await readStdin());

  if (!input) {
    console.error(`Usage:
  node scripts/parse-utm-content.mjs '<utm_content value or URL>'

Example:
  node scripts/parse-utm-content.mjs 'UTM_Content=type=deep~bed=3~ba=1.5~sf_heur=1500~sf_ent=1350~hours_est=5-6~use_eco=no~promo=none~est_after_promo=375-450'`);
    process.exit(1);
  }

  const values = parseUtmContent(input);
  console.log(formatOutput(values));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
