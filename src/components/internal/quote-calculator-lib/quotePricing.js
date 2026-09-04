/** Internal quote calculator only — do not import from public pages. */

export function sqftHeuristicForBedrooms(bedrooms) {
  const n = Math.max(0, Math.floor(Number(bedrooms) || 0));
  if (n <= 0) return 0;
  return 700 + n * 200;
}
