import { describe, expect, it } from "vitest";
import { parseReadingEntryForm } from "./reading-entry";

describe("reading entries", () => {
  it("preserves a quote or note exactly as entered", () => {
    const form = new FormData();
    form.set("content", "  A line\nwith meaning.  ");
    form.set("page", "42");

    const parsed = parseReadingEntryForm(form);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual({ content: "  A line\nwith meaning.  ", page: 42 });
    }
  });

  it("allows an entry without a page", () => {
    const form = new FormData();
    form.set("content", "A thought");
    form.set("page", "");

    expect(parseReadingEntryForm(form).success).toBe(true);
  });

  it("rejects blank content and invalid page numbers", () => {
    const form = new FormData();
    form.set("content", "   ");
    expect(parseReadingEntryForm(form).success).toBe(false);

    form.set("content", "A thought");
    form.set("page", "0");
    expect(parseReadingEntryForm(form).success).toBe(false);
    form.set("page", "1.5");
    expect(parseReadingEntryForm(form).success).toBe(false);
  });
});
