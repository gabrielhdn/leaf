import { describe, expect, it } from "vitest";
import { getReadingProgress, parseCurrentPage } from "./reading-progress";

describe("reading progress", () => {
  it("accepts a current page within the book and allows clearing it", () => {
    expect(parseCurrentPage("62", 100)).toBe(62);
    expect(parseCurrentPage("100", 100)).toBe(100);
    expect(parseCurrentPage("", 100)).toBeNull();
  });

  it("rejects invalid or out-of-range pages", () => {
    expect(parseCurrentPage("101", 100)).toBeUndefined();
    expect(parseCurrentPage("-1", 100)).toBeUndefined();
    expect(parseCurrentPage("2.5", 100)).toBeUndefined();
    expect(parseCurrentPage("2147483648", null)).toBeUndefined();
  });

  it("reports progress only when both page numbers are known", () => {
    expect(getReadingProgress(62, 100)).toBe(62);
    expect(getReadingProgress(1, 3)).toBe(33);
    expect(getReadingProgress(null, 100)).toBeNull();
    expect(getReadingProgress(62, null)).toBeNull();
  });
});
