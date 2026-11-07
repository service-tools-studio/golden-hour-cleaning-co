/**
 * Builds public/geo/phoenix-service-zips.geojson from PHOENIX_SERVICE_ZIP_CODES in markets.
 * Run: npm run geo:phoenix-zips
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function readPhoenixZipsFromMarkets() {
  const text = fs.readFileSync(
    path.join(root, "src/lib/markets.ts"),
    "utf8",
  );
  const block =
    text.match(
      /export const PHOENIX_SERVICE_ZIP_CODES = \[([\s\S]*?)\] as const/,
    )?.[1] ?? "";
  return [...block.matchAll(/"(\d{5})"/g)].map((match) => match[1]);
}

const wanted = new Set(readPhoenixZipsFromMarkets());
if (wanted.size === 0) {
  console.error("Could not read PHOENIX_SERVICE_ZIP_CODES from markets.ts");
  process.exit(1);
}

const AZ_GEOJSON_URL =
  "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/az_arizona_zip_codes_geo.min.json";

function pickZip(properties) {
  for (const key of ["ZCTA5CE10", "ZCTA5CE20", "GEOID10", "ZIP", "zip"]) {
    const value = properties?.[key];
    if (value != null) return String(value).padStart(5, "0");
  }
  return null;
}

const res = await fetch(AZ_GEOJSON_URL);
if (!res.ok) {
  console.error("Failed to download Arizona ZIP GeoJSON:", res.status);
  process.exit(1);
}

const geo = await res.json();
const features = (geo.features ?? []).filter((feature) =>
  wanted.has(pickZip(feature.properties)),
);

if (features.length !== wanted.size) {
  const found = new Set(features.map((f) => pickZip(f.properties)));
  const missing = [...wanted].filter((z) => !found.has(z));
  console.warn(
    `Warning: expected ${wanted.size} ZIPs, matched ${features.length}. Missing:`,
    missing.join(", ") || "(none)",
  );
}

const outDir = path.join(root, "public/geo");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "phoenix-service-zips.geojson");
fs.writeFileSync(
  outPath,
  JSON.stringify({ type: "FeatureCollection", features }),
);
console.log(`Wrote ${features.length} features to ${outPath}`);
