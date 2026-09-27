import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookCover } from "@/components/leaf/book-cover";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { listQuoteFilters, listQuotes } from "@/lib/reading-entries";
import { toggleQuoteFavorite } from "../books/reading-actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const entry = params[key];
  return typeof entry === "string" ? entry : "";
}

export default async function QuotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations("Quotes");
  const search = value(query, "q").trim().slice(0, 100);
  const databaseReady = Boolean(process.env.DATABASE_URL);
  const [filters, owner] = await Promise.all([
    databaseReady ? listQuoteFilters() : Promise.resolve({ books: [], authors: [] }),
    isOwner(),
  ]);
  const bookId = filters.books.find((book) => book.id === value(query, "book"))?.id;
  const authorId = filters.authors.find((author) => author.id === value(query, "author"))?.id;
  const hasFilter = Boolean(search || bookId || authorId);
  const quotes = databaseReady ? await listQuotes({ search: search || undefined, bookId, authorId }) : [];
  const dateFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-7xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t("description")}</p>

      {databaseReady && <form method="get" className="mt-9 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label htmlFor="quote-search" className="sr-only">{t("search")}</label>
        <input id="quote-search" name="q" type="search" maxLength={100} defaultValue={search} placeholder={t("search")} className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        <label htmlFor="quote-book" className="sr-only">{t("bookFilter")}</label>
        <select id="quote-book" name="book" defaultValue={bookId ?? ""} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">{t("allBooks")}</option>
          {filters.books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
        </select>
        <label htmlFor="quote-author" className="sr-only">{t("authorFilter")}</label>
        <select id="quote-author" name="author" defaultValue={authorId ?? ""} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">{t("allAuthors")}</option>
          {filters.authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
        </select>
        <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">{t("apply")}</button>
      </form>}

      {hasFilter && <Link href="/quotes" className="mt-4 inline-block text-sm text-brand underline decoration-warm-accent underline-offset-4">{t("clear")}</Link>}

      {quotes.length ? <div className="mt-8 grid gap-5 md:grid-cols-2">
        {quotes.map((quote) => <article key={quote.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[94px_minmax(0,1fr)] sm:gap-6 sm:p-6">
          <Link href={`/books/${quote.bookId}`} className="self-start"><BookCover title={quote.book.title} coverUrl={quote.book.coverUrl} className="w-full" /></Link>
          <div className="min-w-0">
            <blockquote className="whitespace-pre-wrap font-heading text-2xl leading-snug text-brand sm:text-3xl">{quote.content}</blockquote>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {quote.page && <span>{t("page", { page: quote.page })}</span>}
              <time dateTime={quote.createdAt.toISOString()}>{dateFormat.format(quote.createdAt)}</time>
              {quote.isFavorite && <span className="inline-flex items-center gap-1 text-brand"><Star className="size-3 fill-current" aria-hidden="true" />{t("favorite")}</span>}
            </div>
            <Link href={`/books/${quote.bookId}#quote-${quote.id}`} className="mt-4 block text-sm font-medium text-foreground hover:underline">{quote.book.title}</Link>
            <p className="mt-1 text-xs text-muted-foreground">{quote.book.authors.map(({ author }) => author.name).join(", ")}</p>
            {owner && <form action={toggleQuoteFavorite} className="mt-5">
              <input type="hidden" name="id" value={quote.id} /><input type="hidden" name="bookId" value={quote.bookId} /><input type="hidden" name="locale" value={locale} />
              <Button type="submit" variant="outline" size="sm" aria-pressed={quote.isFavorite}>{quote.isFavorite ? t("unfavorite") : t("markFavorite")}</Button>
            </form>}
          </div>
        </article>)}
      </div> : <div className="mt-8 rounded-xl border border-border bg-card p-8 text-sm leading-7 text-muted-foreground">{!databaseReady ? t("databaseUnavailable") : hasFilter ? t("noResults") : t("empty")}</div>}
    </main>
  );
}
