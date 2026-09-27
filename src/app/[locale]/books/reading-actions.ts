"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { z } from "zod";
import { parseReadingEntryForm, type ReadingEntryKind } from "@/domain/reading-entry";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { requireOwner } from "@/lib/auth/owner-session";
import { getDb } from "@/lib/db";

export type ReadingEntryFormState = { error: "invalid" | "notFound" | null };

const idsSchema = z.object({ bookId: z.uuid(), id: z.uuid() });

function localeFromForm(formData: FormData) {
  const value = formData.get("locale");
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

function revalidateEntryPages(locale: string, bookId: string) {
  revalidatePath(getPathname({ href: `/books/${bookId}`, locale }));
  revalidatePath(getPathname({ href: "/quotes", locale }));
}

export async function saveReadingEntry(
  kind: ReadingEntryKind,
  bookId: string,
  id: string | null,
  _previous: ReadingEntryFormState,
  formData: FormData,
): Promise<ReadingEntryFormState> {
  await requireOwner();
  if (!z.uuid().safeParse(bookId).success || (id && !z.uuid().safeParse(id).success)) {
    return { error: "notFound" };
  }
  const parsed = parseReadingEntryForm(formData);
  if (!parsed.success) return { error: "invalid" };

  const db = getDb();
  if (id) {
    const result = kind === "quote"
      ? await db.quote.updateMany({ where: { id, bookId }, data: parsed.data })
      : await db.bookNote.updateMany({ where: { id, bookId }, data: parsed.data });
    if (result.count === 0) return { error: "notFound" };
  } else {
    const book = await db.book.findUnique({ where: { id: bookId }, select: { id: true } });
    if (!book) return { error: "notFound" };
    if (kind === "quote") {
      await db.quote.create({ data: { bookId, ...parsed.data } });
    } else {
      await db.bookNote.create({ data: { bookId, ...parsed.data } });
    }
  }

  const locale = localeFromForm(formData);
  revalidateEntryPages(locale, bookId);
  redirect(`${getPathname({ href: `/books/${bookId}`, locale })}#${kind === "quote" ? "quotes" : "notes"}`);
}

export async function deleteReadingEntry(formData: FormData): Promise<void> {
  await requireOwner();
  const kind = formData.get("kind");
  const ids = idsSchema.safeParse({ bookId: formData.get("bookId"), id: formData.get("id") });
  if (!ids.success || (kind !== "quote" && kind !== "note")) return;

  const db = getDb();
  if (kind === "quote") {
    await db.quote.deleteMany({ where: { id: ids.data.id, bookId: ids.data.bookId } });
  } else {
    await db.bookNote.deleteMany({ where: { id: ids.data.id, bookId: ids.data.bookId } });
  }
  revalidateEntryPages(localeFromForm(formData), ids.data.bookId);
}

export async function toggleQuoteFavorite(formData: FormData): Promise<void> {
  await requireOwner();
  const ids = idsSchema.safeParse({ bookId: formData.get("bookId"), id: formData.get("id") });
  if (!ids.success) return;

  const db = getDb();
  const quote = await db.quote.findFirst({ where: { id: ids.data.id, bookId: ids.data.bookId } });
  if (!quote) return;
  await db.quote.update({ where: { id: quote.id }, data: { isFavorite: !quote.isFavorite } });
  revalidateEntryPages(localeFromForm(formData), ids.data.bookId);
}
