import { describe, expect, it } from "vitest";
import {
  buildBookingCalendlyUrl,
  resolveLeadMarketIdForCalendly,
} from "./bookingCalendlyUrl";
import { EMPTY_CLEANING_LEAD_FORM } from "@/lib/cleaningLead";

describe("resolveLeadMarketIdForCalendly", () => {
  it("prefers explicit marketId", () => {
    expect(resolveLeadMarketIdForCalendly("phoenix", null)).toBe("phoenix");
  });

  it("infers phoenix from landing path", () => {
    expect(
      resolveLeadMarketIdForCalendly(undefined, {
        landing_path: "/phoenix-move-out-cleaning",
      }),
    ).toBe("phoenix");
  });
});

describe("buildBookingCalendlyUrl", () => {
  it("uses Portland Calendly by default", () => {
    const url = buildBookingCalendlyUrl({
      form: { ...EMPTY_CLEANING_LEAD_FORM, firstName: "A" },
      leadPath: "Book Online",
    });
    expect(url).toContain("golden-hour-cleaning-company/residential-cleaning");
  });

  it("uses Phoenix Calendly when market is phoenix", () => {
    const url = buildBookingCalendlyUrl({
      form: { ...EMPTY_CLEANING_LEAD_FORM, firstName: "A" },
      leadPath: "Book Online",
      marketId: "phoenix",
    });
    expect(url).toContain("golden-hour-cleaning-co-phx/residential-cleaning");
    expect(url).not.toContain("golden-hour-cleaning-company");
  });
});