import "server-only";
import { getDb } from "@/lib/db";
import { assimilateReading } from "@/domain/reading-journey";
import type { ReflectionInput } from "@/domain/reflection-input";

export async function getReflection(bookId: string) {
  return getDb().readingReflection.findUnique({ where: { bookId } });
}

export async function saveReflection(bookId: string, input: ReflectionInput) {
  return getDb().$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book || book.readingStatus !== "READ") return false;

    if (input.content || input.keyIdeas.length) {
      await tx.readingReflection.upsert({
        where: { bookId },
        create: { bookId, content: input.content, keyIdeas: input.keyIdeas },
        update: { content: input.content, keyIdeas: input.keyIdeas },
      });
    } else {
      await tx.readingReflection.deleteMany({ where: { bookId } });
    }
    await tx.book.update({ where: { id: bookId }, data: { rating: input.rating } });
    return true;
  });
}

export async function markAssimilated(bookId: string) {
  return getDb().$transaction(async (tx) => {
    const book = await tx.book.findUnique({ where: { id: bookId } });
    if (!book || book.readingStatus !== "READ") return false;

    const journey = assimilateReading(book);
    await tx.book.update({ where: { id: bookId }, data: { assimilatedAt: journey.assimilatedAt } });
    return true;
  });
}
