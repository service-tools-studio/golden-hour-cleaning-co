import { afterEach, describe, expect, it } from "vitest";
import { getContactInboxEmail } from "./contactInbox";

describe("getContactInboxEmail", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it("prefers CONTACT_INBOX_EMAIL, then COMMERCIAL_QUOTE_TO, then default", () => {
    delete process.env.CONTACT_INBOX_EMAIL;
    delete process.env.COMMERCIAL_QUOTE_TO;
    expect(getContactInboxEmail()).toBe(
      "golden.hour.cleaning.company@gmail.com",
    );

    process.env.COMMERCIAL_QUOTE_TO = "quotes@example.com";
    expect(getContactInboxEmail()).toBe("quotes@example.com");

    process.env.CONTACT_INBOX_EMAIL = "contact@example.com";
    expect(getContactInboxEmail()).toBe("contact@example.com");
  });
});