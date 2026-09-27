import { z } from "zod";

export const readingEntrySchema = z.object({
  content: z.string().max(20_000).refine((value) => value.trim().length > 0),
  page: z.number().int().positive().max(2_147_483_647).optional(),
});

export type ReadingEntryInput = z.infer<typeof readingEntrySchema>;
export type ReadingEntryKind = "quote" | "note";

export function parseReadingEntryForm(formData: FormData) {
  const page = formData.get("page");

  return readingEntrySchema.safeParse({
    content: formData.get("content"),
    page: typeof page === "string" && page !== "" ? Number(page) : undefined,
  });
}
