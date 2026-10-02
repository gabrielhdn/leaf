import { z } from "zod";

export const categoryNameSchema = z.string().max(100).refine((value) => value.trim().length > 0);
export const categoryMutationSchema = z.object({ id: z.uuid(), name: categoryNameSchema });

export type CategoryOption = { id: string; name: string; bookCount: number };

export function categoryKey(name: string): string {
  return name.trim().toLocaleLowerCase("pt");
}
