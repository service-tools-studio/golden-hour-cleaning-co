import { describe, expect, it } from "vitest";
import {
  isMarketId,
  resolveResidentialLegacyHomeRedirect,
} from "@/lib/marketPreference";

describe("marketPreference", () => {
  it("validates market ids", () => {
    expect(isMarketId("portland")).toBe(true);
    expect(isMarketId("phoenix")).toBe(true);
    expect(isMarketId("seattle")).toBe(false);
    expect(isMarketId(null)).toBe(false);
  });

  it("redirects legacy /residential home from preference", () => {
    expect(resolveResidentialLegacyHomeRedirect("phoenix")).toBe("/phoenix");
    expect(resolveResidentialLegacyHomeRedirect("portland")).toBe("/");
    expect(resolveResidentialLegacyHomeRedirect(null)).toBe("/");
  });
});
