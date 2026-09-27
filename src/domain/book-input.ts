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
  coverUrl: z.url().optional(),
  isbn: z.string().max(32).optional(),
  publicationYear: z.number().int().min(1450).max(3000).optional(),
  pageCount: z.number().int().positive().optional(),
  ownershipStatus: z.enum(["OWNED", "WISHLIST"]),
  readingStatus: z.enum(readingStatuses),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

export type BookInput = z.infer<typeof bookInputSchema>;
