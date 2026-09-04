/**
 * Internal-only starting-at tiers (phone script / helper copy).
 * Extends published public tiers with larger home thresholds not shown on the site.
 */

import { STARTING_AT_TIERS } from "../../../lib/startingAtPricing.js";

/** Extra tiers available only in the internal calculator. */
const INTERNAL_EXTRA_TIERS = {
  deep: [
    {
      maxSqft: 3000,
      startingAt: 559,
      sqftLabel: "Homes up to 3,000 sq ft",
    },
  ],
  move_out: [
    {
      maxSqft: 3000,
      startingAt: 860,
      sqftLabel: "Homes up to 3,000 sq ft",
    },
  ],
};

/**
 * @param {string} cleanType
 * @param {number} sqft
 * @returns {{ maxSqft: number, startingAt: number, sqftLabel: string } | null}
 */
export function getInternalStartingAtTier(cleanType, sqft) {
  const publicTiers = STARTING_AT_TIERS[cleanType] || [];
  const extra = INTERNAL_EXTRA_TIERS[cleanType] || [];
  const tiers = [...publicTiers, ...extra];

  if (!tiers.length || !Number.isFinite(sqft) || sqft <= 0) return null;

  for (const tier of tiers) {
    if (sqft <= tier.maxSqft) return tier;
  }

  return null;
}
