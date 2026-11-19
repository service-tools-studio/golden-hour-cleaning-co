import { describe, expect, it } from "vitest";
import {
  isMarketId,
  marketIdFromQueryParam,
  resolveMarketIdForHomePage,
  resolveMarketPreferenceToPersist,
  resolveResidentialLegacyHomeRedirect,
  withMarketQueryForNeutralPath,
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

  it("resolves / home from query only (bare / is Portland)", () => {
    expect(resolveMarketIdForHomePage("phoenix")).toBe("phoenix");
    expect(resolveMarketIdForHomePage("portland")).toBe("portland");
    expect(resolveMarketIdForHomePage(null)).toBe("portland");
  });

  it("persists market from query on any path", () => {
    expect(
      resolveMarketPreferenceToPersist("/", "phoenix"),
    ).toBe("phoenix");
    expect(
      resolveMarketPreferenceToPersist("/about", "phoenix"),
    ).toBe("phoenix");
    expect(
      resolveMarketPreferenceToPersist("/blog", "portland"),
    ).toBe("portland");
  });

  it("does not overwrite preference on neutral funnel paths without query", () => {
    expect(resolveMarketPreferenceToPersist("/book-online", null)).toBe(null);
    expect(resolveMarketPreferenceToPersist("/request-a-quote", null)).toBe(
      null,
    );
    expect(resolveMarketPreferenceToPersist("/about", null)).toBe(null);
  });

  it("appends market query for non-Portland neutral paths", () => {
    expect(
      withMarketQueryForNeutralPath("/book-online", "phoenix"),
    ).toBe("/book-online?market=phoenix");
    expect(
      withMarketQueryForNeutralPath("/book-online", "portland"),
    ).toBe("/book-online");
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
