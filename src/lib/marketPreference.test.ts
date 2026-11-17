import { describe, expect, it } from "vitest";
import {
  isMarketId,
  marketIdFromQueryParam,
  resolveMarketPreferenceToPersist,
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

  it("persists market from query on any path", () => {
    expect(
      resolveMarketPreferenceToPersist("/about", "phoenix"),
    ).toBe("phoenix");
    expect(
      resolveMarketPreferenceToPersist("/blog", "portland"),
    ).toBe("portland");
  });

  it("defaults neutral funnel paths to Portland without query", () => {
    expect(resolveMarketPreferenceToPersist("/book-online", null)).toBe(
      "portland",
    );
    expect(resolveMarketPreferenceToPersist("/about", null)).toBe(null);
  });

  it("does not overwrite stored market when browsing shared Portland URLs", () => {
    expect(resolveMarketPreferenceToPersist("/residential/services", null)).toBe(
      null,
    );
    expect(resolveMarketPreferenceToPersist("/cities/house-cleaning-portland", null)).toBe(
      null,
    );
  });

  it("still persists market home paths without query", () => {
    expect(resolveMarketPreferenceToPersist("/phoenix/services", null)).toBe(
      "phoenix",
    );
    expect(resolveMarketPreferenceToPersist("/", null)).toBe("portland");
  });
});
