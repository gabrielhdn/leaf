"use server";

import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { categoryKey, categoryMutationSchema, type CategoryOption } from "@/domain/categories";
import { requireOwner } from "@/lib/auth/owner-session";
import { getDb } from "@/lib/db";

export async function findCategories(query: string): Promise<CategoryOption[]> {
  const parsed = z.string().max(100).safeParse(query);
  if (!parsed.success) return [];
  const rows = await getDb().category.findMany({
    where: { name: { contains: parsed.data.trim(), mode: "insensitive" } },
    orderBy: { name: "asc" },
    take: 10,
    select: { id: true, name: true, _count: { select: { books: true } } },
  });
  return rows.map(({ _count, ...category }) => ({ ...category, bookCount: _count.books }));
}

export type CategoryMutationResult = { error: "invalid" | "duplicate" | "notFound" | null };

export async function renameCategory(id: string, name: string): Promise<CategoryMutationResult> {
  await requireOwner();
  const parsed = categoryMutationSchema.safeParse({ id, name });
  if (!parsed.success) return { error: "invalid" };
  try {
    await getDb().category.update({ where: { id }, data: { name: parsed.data.name, key: categoryKey(parsed.data.name) } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") return { error: "duplicate" };
      if (error.code === "P2025") return { error: "notFound" };
    }
    throw error;
  }
  revalidatePath("/[locale]", "layout");
  return { error: null };
}

export async function removeCategory(id: string): Promise<CategoryMutationResult> {
  await requireOwner();
  if (!z.uuid().safeParse(id).success) return { error: "invalid" };
  await getDb().category.deleteMany({ where: { id } });
  revalidatePath("/[locale]", "layout");
  return { error: null };
}
