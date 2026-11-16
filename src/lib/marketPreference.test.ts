import { describe, expect, it } from "vitest";
import {
  isMarketId,
  marketIdFromQueryParam,
  resolveLeadFunnelMarketPreference,
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

  it("parses market query param", () => {
    expect(marketIdFromQueryParam("phoenix")).toBe("phoenix");
    expect(marketIdFromQueryParam("Portland")).toBe("portland");
    expect(marketIdFromQueryParam("")).toBe(null);
    expect(marketIdFromQueryParam("seattle")).toBe(null);
  });

  it("defaults lead funnels to Portland without a valid market param", () => {
    expect(resolveLeadFunnelMarketPreference(null)).toBe("portland");
    expect(resolveLeadFunnelMarketPreference("")).toBe("portland");
    expect(resolveLeadFunnelMarketPreference("bogus")).toBe("portland");
    expect(resolveLeadFunnelMarketPreference("phoenix")).toBe("phoenix");
  });
});
