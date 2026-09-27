import { BookOpenText, Plus } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BookCover } from "@/components/leaf/book-cover";
import { Link } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { listBooks, type BookFilter } from "@/lib/books";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function value(params: Record<string, string | string[] | undefined>, key: string) {
  const entry = params[key];
  return typeof entry === "string" ? entry : "";
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations("Home");
  const booksT = await getTranslations("Books");
  const params = await searchParams;
  const search = value(params, "q").trim().slice(0, 100);
  const ownershipValue = value(params, "ownership");
  const readingValue = value(params, "reading");
  const filter: BookFilter = {
    search: search || undefined,
    ownership: ownershipValue === "OWNED" || ownershipValue === "WISHLIST" ? ownershipValue : undefined,
    reading: ["WANT_TO_READ", "READING", "READ", "ABANDONED"].includes(readingValue)
      ? readingValue as BookFilter["reading"]
      : undefined,
  };
  const hasFilter = Boolean(filter.search || filter.ownership || filter.reading);
  const databaseReady = Boolean(process.env.DATABASE_URL);
  const [allBooks, owner] = await Promise.all([
    databaseReady ? listBooks() : Promise.resolve([]),
    isOwner(),
  ]);
  const books = databaseReady && hasFilter ? await listBooks(filter) : allBooks;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
      <section className={`grid items-center gap-9 lg:gap-14 ${allBooks.length ? "" : "lg:grid-cols-[minmax(0,1.07fr)_minmax(0,0.93fr)]"}`}>
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px w-9 bg-warm-accent" aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <h1 className={`font-heading font-medium tracking-[-0.055em] text-brand ${allBooks.length ? "text-5xl leading-none sm:text-6xl" : "max-w-[12ch] text-[clamp(4.1rem,8vw,7.5rem)] leading-[0.83]"}`}>
            {t("title")}
          </h1>
          <p className="mt-8 max-w-[38rem] text-base leading-8 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <p className="mt-9 font-heading text-2xl font-light italic tracking-[0.12em] text-brand">
            {t("motto")}
          </p>
        </div>

        {!allBooks.length && <div className="relative mx-auto flex w-full max-w-[34rem] items-center justify-center overflow-hidden rounded-[2rem] border border-border/70 bg-card px-8 py-5 shadow-[0_18px_50px_-36px_var(--foreground)] sm:px-12 lg:py-8">
          <div aria-hidden="true" className="absolute inset-8 rounded-full border border-warm-accent/30" />
          <Image src="/brand/illustration.png" alt={t("illustrationAlt")} width={1254} height={1254} priority className="relative z-10 h-auto w-full max-w-[25rem] object-contain drop-shadow-lg" />
        </div>}
      </section>

      <section aria-labelledby="shelf-title" className={allBooks.length ? "mt-12" : "mt-20 sm:mt-24"}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpenText className="size-4 text-brand" aria-hidden="true" />{t("shelfLabel")}
            </div>
            <h2 id="shelf-title" className="mt-5 font-heading text-4xl font-medium leading-none tracking-tight text-brand sm:text-5xl">{t("shelfTitle")}</h2>
          </div>
          {owner && databaseReady && <Link href="/books/new" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"><Plus className="size-4" aria-hidden="true" />{booksT("add")}</Link>}
        </div>

        {allBooks.length > 0 && <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["total", allBooks.length],
            ["reading", allBooks.filter((book) => book.readingStatus === "READING").length],
            ["wishlist", allBooks.filter((book) => book.ownershipStatus === "WISHLIST").length],
            ["assimilated", allBooks.filter((book) => book.assimilatedAt).length],
          ] as const).map(([key, count]) => <div key={key} className="rounded-xl border border-border bg-card px-4 py-4"><dt className="text-xs text-muted-foreground">{booksT(`summary.${key}`)}</dt><dd className="mt-2 font-heading text-3xl text-brand">{count}</dd></div>)}
        </dl>}

        {databaseReady && <form method="get" className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <label className="sr-only" htmlFor="book-search">{booksT("filters.search")}</label>
          <input id="book-search" name="q" type="search" maxLength={100} defaultValue={search} placeholder={booksT("filters.search")} className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
          <label className="sr-only" htmlFor="ownership-filter">{booksT("filters.ownership")}</label>
          <select id="ownership-filter" name="ownership" defaultValue={filter.ownership ?? ""} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">{booksT("filters.allOwnership")}</option>
            <option value="OWNED">{booksT("form.owned")}</option>
            <option value="WISHLIST">{booksT("form.wishlist")}</option>
          </select>
          <label className="sr-only" htmlFor="reading-filter">{booksT("filters.reading")}</label>
          <select id="reading-filter" name="reading" defaultValue={filter.reading ?? ""} className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">{booksT("filters.allReading")}</option>
            <option value="WANT_TO_READ">{booksT("form.wantToRead")}</option>
            <option value="READING">{booksT("form.readingNow")}</option>
            <option value="READ">{booksT("form.read")}</option>
            <option value="ABANDONED">{booksT("form.abandoned")}</option>
          </select>
          <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">{booksT("filters.apply")}</button>
        </form>}

        {books.length ? <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => <Link key={book.id} href={`/books/${book.id}`} className="group min-w-0">
            <BookCover title={book.title} coverUrl={book.coverUrl} className="transition-transform group-hover:-translate-y-1" />
            <h3 className="mt-3 line-clamp-2 font-heading text-2xl font-medium leading-tight text-brand group-hover:underline">{book.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{book.authors.map(({ author }) => author.name).join(", ")}</p>
            <p className="mt-2 text-xs text-muted-foreground">{book.ownershipStatus === "WISHLIST" ? booksT("form.wishlist") : booksT(`form.${({ WANT_TO_READ: "wantToRead", READING: "readingNow", READ: "read", ABANDONED: "abandoned" } as const)[book.readingStatus]}`)}</p>
          </Link>)}
        </div> : <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-10 sm:px-10">
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{!databaseReady ? booksT("databaseUnavailable") : hasFilter ? booksT("noResults") : t("shelfDescription")}</p>
          {hasFilter && <Link href="/" className="mt-4 inline-block text-sm text-brand underline decoration-warm-accent underline-offset-4">{booksT("filters.clear")}</Link>}
        </div>}
      </section>
    </main>
  );
}
