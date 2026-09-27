import { describe, expect, it } from "vitest";
import { parseReflectionForm } from "./reflection-input";

describe("reflection input", () => {
  it("preserves the reader's own wording and optional ideas", () => {
    const form = new FormData();
    form.set("content", "  What remained\nwith me.  ");
    form.set("keyIdeas", "First idea\n\n  Second idea  \r\n");
    form.set("rating", "4");

    const parsed = parseReflectionForm(form);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual({
        content: "  What remained\nwith me.  ",
        keyIdeas: ["First idea", "  Second idea  "],
        rating: 4,
      });
    }
  });

  it("allows assimilation without a written reflection or rating", () => {
    const form = new FormData();
    form.set("content", "");
    form.set("keyIdeas", "");
    form.set("rating", "");

    expect(parseReflectionForm(form).success).toBe(true);
    expect(parseReflectionForm(form).data).toEqual({ content: null, keyIdeas: [], rating: null });
  });

  it("rejects invalid ratings and overlong ideas", () => {
    const form = new FormData();
    form.set("rating", "6");
    expect(parseReflectionForm(form).success).toBe(false);

    form.set("rating", "");
    form.set("keyIdeas", "x".repeat(501));
    expect(parseReflectionForm(form).success).toBe(false);
  });
});
