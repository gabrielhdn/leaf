"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { bookInputSchema, parseBookForm } from "@/domain/book-input";
import { PageCountBelowCurrentPageError, parseCurrentPage } from "@/domain/reading-progress";
import { changeReadingStatus } from "@/domain/reading-journey";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { requireOwner } from "@/lib/auth/owner-session";
import { getDb } from "@/lib/db";
import { saveBook } from "@/lib/books";

export type BookFormState = {
  error: "invalid" | "duplicateIsbn" | "notFound" | "pageCountBelowCurrent" | null;
};

export type BookStatusFormState = {
  error: "invalid" | "invalidCurrentPage" | null;
};

const statusSchema = bookInputSchema.pick({ ownershipStatus: true, readingStatus: true });

function localeFromForm(formData: FormData) {
  const value = formData.get("locale");
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

function revalidateLibraryViews(locale: string) {
  for (const href of ["/", "/reading", "/wishlist", "/great-work"] as const) {
    revalidatePath(getPathname({ href, locale }));
  }
}

export async function submitBook(
  id: string | null,
  _previous: BookFormState,
  formData: FormData,
): Promise<BookFormState> {
  await requireOwner();
  const parsed = parseBookForm(formData);
  if (!parsed.success) return { error: "invalid" };

  let book;
  try {
    book = await saveBook(parsed.data, id ?? undefined);
  } catch (error) {
    if (error instanceof PageCountBelowCurrentPageError) return { error: "pageCountBelowCurrent" };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "duplicateIsbn" };
    }
    throw error;
  }

  if (!book) return { error: "notFound" };

  const locale = localeFromForm(formData);
  revalidateLibraryViews(locale);
  redirect(getPathname({ href: `/books/${book.id}`, locale }));
}

export async function updateBookStatus(_previous: BookStatusFormState, formData: FormData): Promise<BookStatusFormState> {
  await requireOwner();
  const id = formData.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return { error: "invalid" };
  const parsed = statusSchema.safeParse({
    ownershipStatus: formData.get("ownershipStatus"),
    readingStatus: formData.get("readingStatus"),
  });
  if (!parsed.success) return { error: "invalid" };

  const db = getDb();
  const current = await db.book.findUnique({ where: { id } });
  if (!current) return { error: "invalid" };
  const rawPage = formData.get("currentPage");
  if (typeof rawPage !== "string") return { error: "invalidCurrentPage" };
  const currentPage = parseCurrentPage(rawPage, current.pageCount);
  if (currentPage === undefined) return { error: "invalidCurrentPage" };
  await db.book.update({
    where: { id },
    data: {
      ownershipStatus: parsed.data.ownershipStatus,
      currentPage,
      ...changeReadingStatus(current, parsed.data.readingStatus),
    },
  });
  const locale = localeFromForm(formData);
  revalidateLibraryViews(locale);
  revalidatePath(getPathname({ href: `/books/${id}`, locale }));
  return { error: null };
}

export async function deleteBook(formData: FormData): Promise<void> {
  await requireOwner();
  const id = formData.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return;

  await getDb().book.delete({ where: { id } });
  const locale = localeFromForm(formData);
  revalidateLibraryViews(locale);
  revalidatePath(getPathname({ href: "/quotes", locale }));
  redirect(getPathname({ href: "/", locale }));
}
