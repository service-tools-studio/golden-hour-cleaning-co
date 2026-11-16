import { describe, expect, it } from "vitest";
import {
  appleMapsSearchUrl,
  formatAddressForEmailHtml,
  formatPhoneForEmailHtml,
  googleMapsSearchUrl,
} from "@/lib/leadEmailHtml";

describe("map search urls", () => {
  it("encodes addresses for Google and Apple Maps", () => {
    const address = "123 Main St, Portland, OR";
    expect(googleMapsSearchUrl(address)).toBe(
      "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20Portland%2C%20OR",
    );
    expect(appleMapsSearchUrl(address)).toBe(
      "https://maps.apple.com/?q=123%20Main%20St%2C%20Portland%2C%20OR",
    );
  });
});

describe("formatPhoneForEmailHtml", () => {
  it("includes a tel anchor only", () => {
    const html = formatPhoneForEmailHtml("(602) 480-9998");
    expect(html).toContain('href="tel:+16024809998"');
    expect(html).not.toContain("Text");
    expect(html).not.toContain("/go/sms");
  });
});

describe("formatAddressForEmailHtml", () => {
  it("includes Google and Apple map links", () => {
    const html = formatAddressForEmailHtml("Scottsdale, AZ");
    expect(html).toContain("google.com/maps/search/");
    expect(html).toContain("maps.apple.com");
    expect(html).toContain("Apple Maps");
  });
});
