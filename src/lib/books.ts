import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import type { BookInput } from "@/domain/book-input";
import { categoryKey } from "@/domain/categories";
import { PageCountBelowCurrentPageError } from "@/domain/reading-progress";
import { changeReadingStatus, type GreatWorkStage, type ReadingJourney } from "@/domain/reading-journey";

export type BookFilter = {
  search?: string;
  ownership?: "OWNED" | "WISHLIST";
  reading?: "WANT_TO_READ" | "READING" | "READ" | "ABANDONED";
  stage?: GreatWorkStage;
  categories?: string[];
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
  categories: { include: { category: true } },
} satisfies Prisma.BookInclude;

export async function listBooks(filter: BookFilter = {}) {
  const db = getDb();
  const where: Prisma.BookWhereInput = {
    ownershipStatus: filter.ownership,
    readingStatus: filter.reading,
    categories: filter.categories?.length
      ? { some: { category: { key: { in: filter.categories.map(categoryKey) } } } }
      : undefined,
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
  const uniqueNames = [...new Map(names.map((name) => [name.toLocaleLowerCase("pt"), name])).values()];
  const relations: { author: { connect: { id: string } } }[] = [];

  for (const name of uniqueNames) {
    const author =
      (await tx.author.findFirst({ where: { name: { equals: name, mode: "insensitive" } } })) ??
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
    const currentPage = input.currentPage === undefined ? current?.currentPage ?? null : input.currentPage;
    if (currentPage !== null && input.pageCount !== undefined && currentPage > input.pageCount) {
      throw new PageCountBelowCurrentPageError();
    }
    const authors = await authorRelations(tx, input.authors);
    const categories: { category: { connect: { id: string } } }[] = [];
    const names = new Map(input.categories.map((name) => [categoryKey(name), name]));
    for (const [key, name] of names) {
      const category = await tx.category.upsert({ where: { key }, update: {}, create: { name, key } });
      categories.push({ category: { connect: { id: category.id } } });
    }

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
      currentPage,
      ownershipStatus: input.ownershipStatus,
      rating: input.rating ?? null,
      ...status,
    };

    if (id) {
      return tx.book.update({
        where: { id },
        data: { ...data, authors: { deleteMany: {}, create: authors }, categories: { deleteMany: {}, create: categories } },
      });
    }

    return tx.book.create({ data: { ...data, authors: { create: authors }, categories: { create: categories } } });
  });
}
