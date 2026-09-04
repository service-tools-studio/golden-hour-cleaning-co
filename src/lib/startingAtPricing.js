/**
 * Published “Starting at” rates by home size — keep in sync across
 * ResidentialPricingGuide and quote calculators.
 */

/** @typedef {"standard" | "deep" | "move_out"} CleanTypeKey */

/**
 * @typedef {{ maxSqft: number, startingAt: number, sqftLabel: string }} StartingAtTier
 */

/** @type {Record<CleanTypeKey, StartingAtTier[]>} */
export const STARTING_AT_TIERS = {
  deep: [
    {
      maxSqft: 1000,
      startingAt: 250,
      sqftLabel: "Homes up to 1,000 sq ft",
    },
    {
      maxSqft: 1500,
      startingAt: 300,
      sqftLabel: "Homes up to 1,500 sq ft",
    },
    {
      maxSqft: 2000,
      startingAt: 429,
      sqftLabel: "Homes up to 2,000 sq ft",
    },
  ],
  move_out: [
    {
      maxSqft: 1000,
      startingAt: 350,
      sqftLabel: "Homes up to 1,000 sq ft",
    },
    {
      maxSqft: 1500,
      startingAt: 460,
      sqftLabel: "Homes up to 1,500 sq ft",
    },
    {
      maxSqft: 2000,
      startingAt: 660,
      sqftLabel: "Homes up to 2,000 sq ft",
    },
  ],
  standard: [
    {
      maxSqft: 1500,
      startingAt: 150,
      sqftLabel: "Homes up to 1,500 sq ft",
    },
    {
      maxSqft: 2000,
      startingAt: 222,
      sqftLabel: "Homes up to 2,000 sq ft",
    },
    {
      maxSqft: 3000,
      startingAt: 292,
      sqftLabel: "Homes up to 3,000 sq ft",
    },
  ],
};

/**
 * @param {CleanTypeKey | string} cleanType
 * @param {number} sqft
 * @returns {StartingAtTier | null}
 */
export function getStartingAtTier(cleanType, sqft) {
  const tiers = STARTING_AT_TIERS[cleanType];
  if (!tiers || !Number.isFinite(sqft) || sqft <= 0) return null;

  for (const tier of tiers) {
    if (sqft <= tier.maxSqft) return tier;
  }

  return null;
}

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatStartingAt(amount) {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

/**
 * Typical upper phone-script price for a published starting-at tier.
 * @param {number} startingAt
 * @returns {number}
 */
export function typicalPhoneRangeHigh(startingAt) {
  return Math.ceil((startingAt + 150) / 50) * 50;
}
