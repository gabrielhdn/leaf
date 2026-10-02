"use server";

import { z } from "zod";
import { getDb } from "@/lib/db";

export async function findAuthors(query: string): Promise<{ id: string; name: string }[]> {
  const parsed = z.string().max(200).safeParse(query);
  if (!parsed.success) return [];
  return getDb().author.findMany({
    where: { name: { contains: parsed.data.trim(), mode: "insensitive" } },
    orderBy: { name: "asc" },
    take: 10,
    select: { id: true, name: true },
  });
}
