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
};

function readStored(): PpcAttribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore quota / private-mode failures; in-memory value still works for this visit.
  }
}

/** Capture inbound Ads/UTM params once and keep them for the in-page booking flow. */
export function capturePpcAttribution(): PpcAttribution {
  if (typeof window === "undefined") return {};

  const stored = readStored();
  const params = new URLSearchParams(window.location.search);
  const fromUrl: PpcAttribution = {};

  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }

  const merged: PpcAttribution = {
    ...stored,
    ...fromUrl,
    landing_path: stored.landing_path || window.location.pathname,
  };

  if (Object.keys(fromUrl).length > 0 || !stored.landing_path) {
    writeStored(merged);
  }

  return merged;
}

export function getPpcAttribution(): PpcAttribution {
  return capturePpcAttribution();
}
