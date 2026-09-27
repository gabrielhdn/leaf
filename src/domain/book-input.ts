import { z } from "zod";
import { readingStatuses } from "./reading-journey";

const nonBlankText = (max: number) =>
  z
    .string()
    .max(max)
    .refine((value) => value.trim().length > 0, "Required");

export const bookInputSchema = z.object({
  title: nonBlankText(300),
  authors: z.array(nonBlankText(200)).min(1),
  description: z.string().max(20_000).optional(),
  coverUrl: z.url().refine((value) => /^https?:\/\//i.test(value)).optional(),
  isbn: z.string().max(32).optional(),
  publicationYear: z.number().int().min(1450).max(3000).optional(),
  pageCount: z.number().int().positive().optional(),
  ownershipStatus: z.enum(["OWNED", "WISHLIST"]),
  readingStatus: z.enum(readingStatuses),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

export type BookInput = z.infer<typeof bookInputSchema>;

function optionalText(value: FormDataEntryValue | null): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  const text = optionalText(value);
  return text === undefined ? undefined : Number(text);
}

export function parseBookForm(formData: FormData) {
  const authors = formData.get("authors");

  return bookInputSchema.safeParse({
    title: formData.get("title"),
    authors:
      typeof authors === "string"
        ? authors.split("\n").map((author) => author.replace(/\r$/, "")).filter((author) => author.trim())
        : [],
    description: optionalText(formData.get("description")),
    coverUrl: optionalText(formData.get("coverUrl")),
    isbn: optionalText(formData.get("isbn")),
    publicationYear: optionalNumber(formData.get("publicationYear")),
    pageCount: optionalNumber(formData.get("pageCount")),
    ownershipStatus: formData.get("ownershipStatus"),
    readingStatus: formData.get("readingStatus"),
    rating: optionalNumber(formData.get("rating")) ?? null,
  });
}
