import { describe, expect, it } from "vitest";
import { marketIdForcedByPath } from "./useSelectPreferredMarket";

describe("marketIdForcedByPath", () => {
  it("returns portland for / and phoenix for /phoenix routes", () => {
    expect(marketIdForcedByPath("/")).toBe("portland");
    expect(marketIdForcedByPath("/phoenix")).toBe("phoenix");
    expect(marketIdForcedByPath("/phoenix/about")).toBe("phoenix");
  });

  it("returns null for neutral and shared paths", () => {
    expect(marketIdForcedByPath("/contact")).toBeNull();
    expect(marketIdForcedByPath("/about")).toBeNull();
  });
});