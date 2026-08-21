"use client";

const STORAGE_KEY = "ghc_ppc_attribution";

const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
] as const;

export type PpcAttribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  landing_path?: string;
  /** ISO timestamp of the advertising touch currently stored. */
  captured_at?: string;
};

function hasAttributionTouch(value: PpcAttribution) {
  return ATTRIBUTION_KEYS.some((key) => Boolean(value[key]));
}

function readStored(): PpcAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PpcAttribution;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStored(value: PpcAttribution) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    // Drop the old session-only copy once we've persisted durably.
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore quota / private-mode failures; in-memory value still works for this visit.
  }
}

/**
 * Capture inbound Ads/UTM params and keep them for later booking.
 * New paid/UTM params overwrite prior ones (last-click). landing_path and
 * captured_at update whenever a new attribution touch arrives.
 */
export function capturePpcAttribution(): PpcAttribution {
  if (typeof window === "undefined") return {};

  const stored = readStored();
  const params = new URLSearchParams(window.location.search);
  const fromUrl: PpcAttribution = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }

  const hasNewAttribution = Object.keys(fromUrl).length > 0;

  const merged: PpcAttribution = {
    ...stored,
    ...fromUrl,
    landing_path: hasNewAttribution
      ? window.location.pathname
      : stored.landing_path || window.location.pathname,
  };

  if (hasNewAttribution) {
    merged.captured_at = new Date().toISOString();
  } else if (stored.captured_at) {
    merged.captured_at = stored.captured_at;
  } else if (hasAttributionTouch(merged)) {
    // Backfill older stored records that predate captured_at.
    merged.captured_at = new Date().toISOString();
  }

  if (
    hasNewAttribution ||
    !stored.landing_path ||
    (hasAttributionTouch(merged) && !stored.captured_at)
  ) {
    writeStored(merged);
  }

  return merged;
}

export function getPpcAttribution(): PpcAttribution {
  return capturePpcAttribution();
}
