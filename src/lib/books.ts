import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import type { BookInput } from "@/domain/book-input";
import { PageCountBelowCurrentPageError } from "@/domain/reading-progress";
import { changeReadingStatus, type GreatWorkStage, type ReadingJourney } from "@/domain/reading-journey";

export type BookFilter = {
  search?: string;
  ownership?: "OWNED" | "WISHLIST";
  reading?: "WANT_TO_READ" | "READING" | "READ" | "ABANDONED";
  stage?: GreatWorkStage;
};

function stageWhere(stage: GreatWorkStage): Prisma.BookWhereInput {
  switch (stage) {
    case "NIGREDO": return { readingStatus: "WANT_TO_READ" };
    case "ALBEDO": return { readingStatus: "READING" };
    case "CITRINITAS": return { readingStatus: "READ", assimilatedAt: null };
    case "RUBEDO": return { readingStatus: "READ", assimilatedAt: { not: null } };
  }
}

const bookInclude = {
  authors: { include: { author: true } },
} satisfies Prisma.BookInclude;

export async function listBooks(filter: BookFilter = {}) {
  const db = getDb();
  const where: Prisma.BookWhereInput = {
    ownershipStatus: filter.ownership,
    readingStatus: filter.reading,
    AND: filter.stage ? [stageWhere(filter.stage)] : undefined,
    OR: filter.search
      ? [
          { title: { contains: filter.search, mode: "insensitive" } },
          { authors: { some: { author: { name: { contains: filter.search, mode: "insensitive" } } } } },
        ]
      : undefined,
  };

  return db.book.findMany({ where, include: bookInclude, orderBy: { createdAt: "desc" } });
}

export async function getBook(id: string) {
  return getDb().book.findUnique({ where: { id }, include: bookInclude });
}

async function authorRelations(tx: Prisma.TransactionClient, names: string[]) {
  const uniqueNames = [...new Set(names)];
  const relations: { author: { connect: { id: string } } }[] = [];

  for (const name of uniqueNames) {
    const author =
      (await tx.author.findFirst({ where: { name } })) ??
      (await tx.author.create({ data: { name } }));
    relations.push({ author: { connect: { id: author.id } } });
  }

  return relations;
}

export async function saveBook(input: BookInput, id?: string) {
  const db = getDb();

  return db.$transaction(async (tx) => {
    const current = id ? await tx.book.findUnique({ where: { id } }) : null;
    if (id && !current) return null;
    if (current && current.currentPage !== null && input.pageCount !== undefined && current.currentPage > input.pageCount) {
      throw new PageCountBelowCurrentPageError();
    }
    const authors = await authorRelations(tx, input.authors);

    const journey: ReadingJourney = current ?? {
      readingStatus: "WANT_TO_READ",
      startedAt: null,
      finishedAt: null,
      assimilatedAt: null,
    };
    const status = changeReadingStatus(journey, input.readingStatus);
    const data = {
      title: input.title,
      description: input.description ?? null,
      coverUrl: input.coverUrl ?? null,
      isbn: input.isbn ?? null,
      publicationYear: input.publicationYear ?? null,
      pageCount: input.pageCount ?? null,
      ownershipStatus: input.ownershipStatus,
      rating: input.rating ?? null,
      ...status,
    };

    if (id) {
      return tx.book.update({
        where: { id },
        data: { ...data, authors: { deleteMany: {}, create: authors } },
      });
    }

    return tx.book.create({ data: { ...data, authors: { create: authors } } });
  });
}
