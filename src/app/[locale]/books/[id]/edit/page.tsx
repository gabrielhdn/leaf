import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { getBook } from "@/lib/books";
import { BookForm } from "../../book-form";

export const dynamic = "force-dynamic";

export default async function EditBookPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!(await isOwner())) redirect({ href: "/login", locale });
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const book = await getBook(id);
  if (!book) notFound();
  const t = await getTranslations("Books");

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("form.eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-6xl">{t("form.editTitle")}</h1>
      <div className="mt-9 rounded-2xl border border-border bg-card p-6 sm:p-9">
        <BookForm locale={locale} id={id} initial={{
          title: book.title,
          authors: book.authors.map(({ author }) => author.name),
          description: book.description ?? undefined,
          coverUrl: book.coverUrl ?? undefined,
          isbn: book.isbn ?? undefined,
          publicationYear: book.publicationYear ?? undefined,
          pageCount: book.pageCount ?? undefined,
          ownershipStatus: book.ownershipStatus,
          readingStatus: book.readingStatus,
          rating: book.rating,
        }} />
      </div>
    </main>
  );
}
