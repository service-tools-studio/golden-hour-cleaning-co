/** Frozen Sept 2026 — used only by PreservedQuoteCalculator. Do not import elsewhere. */

export function sqftHeuristicForBedrooms(bedrooms) {
  const n = Math.max(0, Math.floor(Number(bedrooms) || 0));
  if (n <= 0) return 0;
  if (n === 1) return 1000;
  if (n === 2) return 1100;
  if (n === 3) return 1500;
  if (n === 4) return 1900;
  return 2200;
}
