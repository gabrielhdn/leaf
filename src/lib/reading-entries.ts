import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";

export async function listBookEntries(bookId: string) {
  const db = getDb();
  const [quotes, notes] = await Promise.all([
    db.quote.findMany({ where: { bookId }, orderBy: { createdAt: "asc" } }),
    db.bookNote.findMany({ where: { bookId }, orderBy: { createdAt: "asc" } }),
  ]);

  return { quotes, notes };
}

export type QuoteFilter = {
  search?: string;
  bookId?: string;
  authorId?: string;
};

export async function listQuotes(filter: QuoteFilter = {}) {
  const where: Prisma.QuoteWhereInput = {
    bookId: filter.bookId,
    book: filter.authorId
      ? { authors: { some: { authorId: filter.authorId } } }
      : undefined,
    OR: filter.search
      ? [
          { content: { contains: filter.search, mode: "insensitive" } },
          { book: { title: { contains: filter.search, mode: "insensitive" } } },
          { book: { authors: { some: { author: { name: { contains: filter.search, mode: "insensitive" } } } } } },
        ]
      : undefined,
  };

  return getDb().quote.findMany({
    where,
    include: { book: { include: { authors: { include: { author: true } } } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function listQuoteFilters() {
  const db = getDb();
  const [books, authors] = await Promise.all([
    db.book.findMany({
      where: { quotes: { some: {} } },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    db.author.findMany({
      where: { books: { some: { book: { quotes: { some: {} } } } } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { books, authors };
}
