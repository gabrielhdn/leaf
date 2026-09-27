import { z } from "zod";

export const reflectionInputSchema = z.object({
  content: z.string().max(20_000).nullable(),
  keyIdeas: z.array(z.string().max(500).refine((value) => value.trim().length > 0)).max(20),
  rating: z.number().int().min(1).max(5).nullable(),
});

export type ReflectionInput = z.infer<typeof reflectionInputSchema>;

export function parseReflectionForm(formData: FormData) {
  const content = formData.get("content");
  const keyIdeas = formData.get("keyIdeas");
  const rating = formData.get("rating");

  return reflectionInputSchema.safeParse({
    content: typeof content === "string" && content.trim() ? content : null,
    keyIdeas: typeof keyIdeas === "string"
      ? keyIdeas.split("\n").map((idea) => idea.replace(/\r$/, "")).filter((idea) => idea.trim())
      : [],
    rating: typeof rating === "string" && rating !== "" ? Number(rating) : null,
  });
}
