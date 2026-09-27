import { describe, expect, it } from "vitest";
import { verifyOwnerPassword } from "./owner-password";

describe("owner password", () => {
  it("accepts only the configured password", () => {
    const password = "a-long-private-owner-password";

    expect(verifyOwnerPassword(password, password)).toBe(true);
    expect(verifyOwnerPassword("wrong-password", password)).toBe(false);
  });

  it("fails closed when the password is missing or too short", () => {
    expect(verifyOwnerPassword("anything", undefined)).toBe(false);
    expect(verifyOwnerPassword("short", "short")).toBe(false);
  });
});
