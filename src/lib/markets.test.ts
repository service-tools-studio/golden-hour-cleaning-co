import { describe, expect, it } from "vitest";
import {
  MARKETS,
  buildMarketMetadata,
  getMarketById,
  getMarketIdFromPath,
} from "@/lib/markets";

describe("markets", () => {
  it("resolves portland as /", () => {
    expect(getMarketIdFromPath("/")).toBe("portland");
    expect(getMarketById("portland").path).toBe("/");
  });

  it("resolves phoenix path", () => {
    expect(getMarketIdFromPath("/phoenix")).toBe("phoenix");
    expect(getMarketById("phoenix").path).toBe("/phoenix");
  });

  it("uses distinct SEO canonicals", () => {
    const portland = buildMarketMetadata(MARKETS.portland);
    const phoenix = buildMarketMetadata(MARKETS.phoenix);
    expect(portland.alternates?.canonical).toBe("/");
    expect(phoenix.alternates?.canonical).toBe("/phoenix");
    expect(portland.title).not.toBe(phoenix.title);
  });

  it("localizes hero headlines", () => {
    expect(MARKETS.portland.hero.headline).toMatch(/Portland/i);
    expect(MARKETS.phoenix.hero.headline).toMatch(/Phoenix/i);
    expect(MARKETS.phoenix.hero.headline).not.toMatch(/Portland/i);
  });

  it("uses distinct service detail paths per market", () => {
    expect(MARKETS.phoenix.servicesHubPath).toBe("/phoenix/services");
    expect(`${MARKETS.phoenix.servicesHubPath}/deep`).toBe(
      "/phoenix/services/deep",
    );
  });

  it("configures Phoenix shaded ZIP map", () => {
    expect(MARKETS.phoenix.serviceArea.map?.geoJsonUrl).toBe(
      "/geo/phoenix-service-zips.geojson",
    );
    expect(MARKETS.phoenix.serviceArea.zipCodesLine).toContain("85016");
  });

  it("does not show Portland aggregate rating on Phoenix reviews config", () => {
    expect(MARKETS.phoenix.reviews.showAggregateFromGoogle).toBe(false);
    expect(MARKETS.phoenix.reviews.portfolioAttributionNote).toBeTruthy();
  });

  it("exposes distinct services hub paths per market", () => {
    expect(MARKETS.portland.servicesHubPath).toBe("/residential/services");
    expect(MARKETS.phoenix.servicesHubPath).toBe("/phoenix/services");
  });
});
