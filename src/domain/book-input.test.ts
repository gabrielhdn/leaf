import { describe, expect, it } from "vitest";
import { bookInputSchema, parseBookForm } from "./book-input";

const validBook = {
  title: "  A hora da estrela  ",
  authors: ["Clarice Lispector", "Second author"],
  description: "A reader's own description stays untouched.",
  ownershipStatus: "OWNED",
  readingStatus: "WANT_TO_READ",
} as const;

describe("book input", () => {
  it("accepts multiple authors and preserves entered content", () => {
    const book = bookInputSchema.parse(validBook);

    expect(book.title).toBe(validBook.title);
    expect(book.authors).toEqual(validBook.authors);
    expect(book.description).toBe(validBook.description);
  });

  it("requires a title and at least one nonblank author", () => {
    expect(bookInputSchema.safeParse({ ...validBook, title: "   " }).success).toBe(
      false,
    );
    expect(bookInputSchema.safeParse({ ...validBook, authors: [] }).success).toBe(
      false,
    );
    expect(
      bookInputSchema.safeParse({ ...validBook, authors: ["  "] }).success,
    ).toBe(false);
  });

  it("rejects invalid ratings and page counts", () => {
    expect(bookInputSchema.safeParse({ ...validBook, rating: 6 }).success).toBe(
      false,
    );
    expect(bookInputSchema.safeParse({ ...validBook, pageCount: 0 }).success).toBe(
      false,
    );
  });

  it("parses optional form fields without changing entered content", () => {
    const form = new FormData();
    form.set("title", "  A hora da estrela  ");
    form.set("authors", "Clarice Lispector\n\n  Outro autor  \r\n");
    form.set("description", "  My note  ");
    form.set("ownershipStatus", "OWNED");
    form.set("readingStatus", "READING");
    form.set("pageCount", "100");

    const parsed = parseBookForm(form);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.authors).toEqual(["Clarice Lispector", "  Outro autor  "]);
      expect(parsed.data.description).toBe("  My note  ");
      expect(parsed.data.pageCount).toBe(100);
      expect(parsed.data.rating).toBeNull();
    }
  });

  it("rejects malformed numeric form fields", () => {
    const form = new FormData();
    form.set("title", "Book");
    form.set("authors", "Author");
    form.set("ownershipStatus", "OWNED");
    form.set("readingStatus", "WANT_TO_READ");
    form.set("pageCount", "not-a-number");

    expect(parseBookForm(form).success).toBe(false);
  });

  it("accepts web cover URLs only", () => {
    expect(bookInputSchema.safeParse({ ...validBook, coverUrl: "https://example.com/cover.jpg" }).success).toBe(true);
    expect(bookInputSchema.safeParse({ ...validBook, coverUrl: "javascript:alert(1)" }).success).toBe(false);
  });
});
