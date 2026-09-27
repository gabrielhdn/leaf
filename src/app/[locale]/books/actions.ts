"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { bookInputSchema, parseBookForm } from "@/domain/book-input";
import { changeReadingStatus } from "@/domain/reading-journey";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { requireOwner } from "@/lib/auth/owner-session";
import { getDb } from "@/lib/db";
import { saveBook } from "@/lib/books";

export type BookFormState = {
  error: "invalid" | "duplicateIsbn" | "notFound" | null;
};

const statusSchema = bookInputSchema.pick({ ownershipStatus: true, readingStatus: true });

function localeFromForm(formData: FormData) {
  const value = formData.get("locale");
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "duplicateIsbn" };
    }
    throw error;
  }

  if (!book) return { error: "notFound" };

  const locale = localeFromForm(formData);
  revalidatePath(getPathname({ href: "/", locale }));
  redirect(getPathname({ href: `/books/${book.id}`, locale }));
}

export async function updateBookStatus(formData: FormData): Promise<void> {
  await requireOwner();
  const id = formData.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return;
  const parsed = statusSchema.safeParse({
    ownershipStatus: formData.get("ownershipStatus"),
    readingStatus: formData.get("readingStatus"),
  });
  if (!parsed.success) return;

  const db = getDb();
  const current = await db.book.findUnique({ where: { id } });
  if (!current) return;
  await db.book.update({
    where: { id },
    data: {
      ownershipStatus: parsed.data.ownershipStatus,
      ...changeReadingStatus(current, parsed.data.readingStatus),
    },
  });
  const locale = localeFromForm(formData);
  revalidatePath(getPathname({ href: "/", locale }));
  revalidatePath(getPathname({ href: `/books/${id}`, locale }));
}

export async function deleteBook(formData: FormData): Promise<void> {
  await requireOwner();
  const id = formData.get("id");
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return;

  await getDb().book.delete({ where: { id } });
  const locale = localeFromForm(formData);
  revalidatePath(getPathname({ href: "/", locale }));
  revalidatePath(getPathname({ href: "/quotes", locale }));
  redirect(getPathname({ href: "/", locale }));
}
