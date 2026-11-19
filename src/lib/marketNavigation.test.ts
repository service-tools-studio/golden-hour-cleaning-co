import { describe, expect, it } from "vitest";
import {
  resolveActiveMarketId,
  resolveMarketAboutHref,
  resolveMarketingHrefForMarket,
  resolveMarketHomeHref,
  resolveServicesHubHref,
} from "@/lib/marketNavigation";

describe("resolveServicesHubHref", () => {
  it("prefers stored market on neutral paths", () => {
    expect(
      resolveServicesHubHref({
        pathname: "/about",
        preferredMarket: "phoenix",
      }),
    ).toBe("/phoenix/services");
    expect(
      resolveServicesHubHref({
        pathname: "/",
        preferredMarket: "phoenix",
      }),
    ).toBe("/residential/services");
  });

  it("resolves canonical homes from pathname", () => {
    expect(
      resolveMarketHomeHref({
        pathname: "/",
        preferredMarket: "phoenix",
      }),
    ).toBe("/");
    expect(
      resolveMarketHomeHref({
        pathname: "/phoenix",
        preferredMarket: "portland",
      }),
    ).toBe("/phoenix");
    expect(
      resolveMarketHomeHref({
        pathname: "/about",
        preferredMarket: "phoenix",
      }),
    ).toBe("/phoenix");
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

  it("treats bare / as Portland even when Phoenix is stored", () => {
    expect(
      resolveActiveMarketId({
        preferredMarket: "phoenix",
        pathname: "/",
      }),
    ).toBe("portland");
    expect(
      resolveActiveMarketId({
        marketQueryParam: "phoenix",
        preferredMarket: "portland",
        pathname: "/",
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

  it("prefers market query param over storage", () => {
    expect(
      resolveActiveMarketId({
        marketQueryParam: "phoenix",
        preferredMarket: "portland",
        pathname: "/about",
      }),
    ).toBe("phoenix");
    expect(
      resolveServicesHubHref({
        marketQueryParam: "phoenix",
        preferredMarket: "portland",
        pathname: "/about",
      }),
    ).toBe("/phoenix/services");
  });
});

describe("resolveMarketingHrefForMarket", () => {
  it("rewrites Portland service paths for Phoenix", () => {
    expect(
      resolveMarketingHrefForMarket("/residential/services/deep", "phoenix"),
    ).toBe("/phoenix/services/deep");
    expect(resolveMarketingHrefForMarket("/residential/quote", "phoenix")).toBe(
      "/phoenix#quote",
    );
    expect(resolveMarketingHrefForMarket("/about", "phoenix")).toBe(
      "/phoenix/about",
    );
  });

  it("leaves paths unchanged for Portland", () => {
    expect(
      resolveMarketingHrefForMarket("/residential/services", "portland"),
    ).toBe("/residential/services");
  });
});
