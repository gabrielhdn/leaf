import { createHash, timingSafeEqual } from "node:crypto";

export function verifyOwnerPassword(
  candidate: string,
  configuredPassword: string | undefined,
): boolean {
  if (!configuredPassword || configuredPassword.length < 16) return false;

  const expected = createHash("sha256").update(configuredPassword).digest();
  const received = createHash("sha256").update(candidate).digest();

  return timingSafeEqual(received, expected);
}
