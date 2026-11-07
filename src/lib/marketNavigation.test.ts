import { describe, expect, it } from "vitest";
import {
  resolveActiveMarketId,
  resolveMarketAboutHref,
  resolveMarketHomeHref,
  resolveServicesHubHref,
} from "@/lib/marketNavigation";

describe("resolveServicesHubHref", () => {
  it("prefers stored market when set", () => {
    expect(
      resolveServicesHubHref({
        pathname: "/",
        preferredMarket: "phoenix",
      }),
    ).toBe("/phoenix/services");
    expect(
      resolveServicesHubHref({
        pathname: "/phoenix",
        preferredMarket: "portland",
      }),
    ).toBe("/residential/services");
  });

  it("resolves market home from preference", () => {
    expect(
      resolveMarketHomeHref({
        pathname: "/",
        preferredMarket: "phoenix",
      }),
    ).toBe("/phoenix");
    expect(
      resolveMarketHomeHref({
        pathname: "/phoenix",
        preferredMarket: "portland",
      }),
    ).toBe("/");
  });

  it("uses pathname when no preference", () => {
    expect(resolveServicesHubHref({ pathname: "/phoenix" })).toBe(
      "/phoenix/services",
    );
    expect(resolveServicesHubHref({ pathname: "/phoenix/services" })).toBe(
      "/phoenix/services",
    );
    expect(resolveServicesHubHref({ pathname: "/" })).toBe(
      "/residential/services",
    );
  });
});

describe("resolveActiveMarketId", () => {
  it("prefers stored market on neutral pages", () => {
    expect(
      resolveActiveMarketId({
        preferredMarket: "phoenix",
        pathname: "/request-a-quote",
      }),
    ).toBe("phoenix");
  });

  it("uses phoenix PPC path when no preference", () => {
    expect(
      resolveActiveMarketId({
        pathname: "/phoenix-deep-cleaning",
      }),
    ).toBe("phoenix");
  });

  it("uses stored phoenix preference on market-neutral pages", () => {
    expect(
      resolveActiveMarketId({
        preferredMarket: "phoenix",
        pathname: "/book-online",
      }),
    ).toBe("phoenix");
    expect(
      resolveMarketAboutHref({
        preferredMarket: "phoenix",
        pathname: "/reviews",
      }),
    ).toBe("/phoenix/about");
  });
});
