#!/usr/bin/env node

/**
 * Parse Golden Hour quote calculator utm_content values.
 *
 * Usage:
 *   npm run parse-utm -- 'UTM_Content=type=deep~bed=3~ba=1.5~...'
 *   node scripts/parse-utm-content.mjs 'https://calendly.com/...?utm_content=...'
 *   echo 'type=deep~bed=3~...' | node scripts/parse-utm-content.mjs
 */

import { formatUtmContent } from "../src/helpers/parseUtmContent.mjs";

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

  console.log(formatUtmContent(input));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
