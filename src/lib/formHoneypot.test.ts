import { describe, expect, it } from "vitest";
import { isHoneypotTripped } from "@/lib/formHoneypot";

describe("isHoneypotTripped", () => {
  it("is false when empty", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped(null)).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });

  it("is true when bots fill the field", () => {
    expect(isHoneypotTripped("https://spam.example")).toBe(true);
  });
});