import { describe, expect, it } from "vitest";
import { bookInputSchema } from "./book-input";

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
});
