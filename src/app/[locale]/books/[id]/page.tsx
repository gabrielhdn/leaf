import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BookCover } from "@/components/leaf/book-cover";
import { Link } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { getBook } from "@/lib/books";
import { deleteBook, updateBookStatus } from "../actions";
import { DeleteButton } from "../delete-button";

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !process.env.DATABASE_URL) notFound();
  const book = await getBook(id);
  if (!book) notFound();

  const t = await getTranslations("Books");
  const owner = await isOwner();
  const dateFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <Link href="/" className="text-sm text-muted-foreground underline decoration-warm-accent underline-offset-4 hover:text-foreground">{t("detail.back")}</Link>
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(180px,280px)_1fr] lg:gap-16">
        <BookCover title={book.title} coverUrl={book.coverUrl} className="w-full max-w-[280px] shadow-md" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("detail.eyebrow")}</p>
          <h1 className="mt-4 font-heading text-5xl font-medium leading-none text-brand sm:text-7xl">{book.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{book.authors.map(({ author }) => author.name).join(", ")}</p>
          <div className="mt-7 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-border bg-card px-3 py-1">{t(`form.${book.ownershipStatus === "OWNED" ? "owned" : "wishlist"}`)}</span>
            <span className="rounded-full border border-border bg-card px-3 py-1">{t(`form.${({ WANT_TO_READ: "wantToRead", READING: "readingNow", READ: "read", ABANDONED: "abandoned" } as const)[book.readingStatus]}`)}</span>
          </div>
          <dl className="mt-9 grid grid-cols-2 gap-x-7 gap-y-5 border-t border-border pt-6 text-sm sm:grid-cols-3">
            {book.publicationYear && <div><dt className="text-muted-foreground">{t("form.publicationYear")}</dt><dd className="mt-1 font-medium">{book.publicationYear}</dd></div>}
            {book.pageCount && <div><dt className="text-muted-foreground">{t("form.pageCount")}</dt><dd className="mt-1 font-medium">{book.pageCount}</dd></div>}
            {book.isbn && <div><dt className="text-muted-foreground">{t("form.isbn")}</dt><dd className="mt-1 font-medium">{book.isbn}</dd></div>}
            {book.rating && <div><dt className="text-muted-foreground">{t("form.rating")}</dt><dd className="mt-1 font-medium">{book.rating}/5</dd></div>}
            {book.startedAt && <div><dt className="text-muted-foreground">{t("detail.startedAt")}</dt><dd className="mt-1 font-medium">{dateFormat.format(book.startedAt)}</dd></div>}
            {book.finishedAt && <div><dt className="text-muted-foreground">{t("detail.finishedAt")}</dt><dd className="mt-1 font-medium">{dateFormat.format(book.finishedAt)}</dd></div>}
          </dl>
          {book.description && <section className="mt-10 border-t border-border pt-7"><h2 className="font-heading text-3xl text-brand">{t("detail.description")}</h2><p className="mt-3 whitespace-pre-wrap leading-8 text-muted-foreground">{book.description}</p></section>}
          {owner && <form action={updateBookStatus} className="mt-10 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <input type="hidden" name="id" value={id} /><input type="hidden" name="locale" value={locale} />
            <div className="space-y-2"><label htmlFor="detail-ownership" className="text-sm font-medium">{t("form.ownership")}</label><select id="detail-ownership" name="ownershipStatus" defaultValue={book.ownershipStatus} className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"><option value="OWNED">{t("form.owned")}</option><option value="WISHLIST">{t("form.wishlist")}</option></select></div>
            <div className="space-y-2"><label htmlFor="detail-reading" className="text-sm font-medium">{t("form.reading")}</label><select id="detail-reading" name="readingStatus" defaultValue={book.readingStatus} className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"><option value="WANT_TO_READ">{t("form.wantToRead")}</option><option value="READING">{t("form.readingNow")}</option><option value="READ">{t("form.read")}</option><option value="ABANDONED">{t("form.abandoned")}</option></select></div>
            <button type="submit" className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">{t("detail.updateStatus")}</button>
          </form>}
          {owner && <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-7">
            <Link href={`/books/${id}/edit`} className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">{t("detail.edit")}</Link>
            <form action={deleteBook}><input type="hidden" name="id" value={id} /><input type="hidden" name="locale" value={locale} /><DeleteButton /></form>
          </div>}
        </div>
      </div>
    </main>
  );
}
