import { BookOpenText, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookCard } from "@/components/leaf/book-card";
import { HomeDashboard } from "@/components/leaf/home-dashboard";
import { Select } from "@/components/ui/select";
import { greatWorkStages } from "@/domain/reading-journey";
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
  const greatT = await getTranslations("GreatWork");
  const params = await searchParams;
  const search = value(params, "q").trim().slice(0, 100);
  const ownershipValue = value(params, "ownership");
  const readingValue = value(params, "reading");
  const stageValue = value(params, "stage");
  const filter: BookFilter = {
    search: search || undefined,
    ownership: ownershipValue === "OWNED" || ownershipValue === "WISHLIST" ? ownershipValue : undefined,
    reading: ["WANT_TO_READ", "READING", "READ", "ABANDONED"].includes(readingValue)
      ? readingValue as BookFilter["reading"]
      : undefined,
    stage: greatWorkStages.find((stage) => stage === stageValue),
  };
  const hasFilter = Boolean(filter.search || filter.ownership || filter.reading || filter.stage);
  const databaseReady = Boolean(process.env.DATABASE_URL);
  const [allBooks, owner] = await Promise.all([
    databaseReady ? listBooks() : Promise.resolve([]),
    isOwner(),
  ]);
  const books = databaseReady && hasFilter ? await listBooks(filter) : allBooks;

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-12">
      <section className="relative isolate min-h-[23rem] overflow-hidden pb-8 sm:min-h-[24rem] sm:pb-10">
        <div aria-hidden="true" className="home-hero-art pointer-events-none absolute inset-0 -z-20" />
        <div aria-hidden="true" className="home-hero-fade pointer-events-none absolute inset-0 -z-10" />
        <div className="relative max-w-4xl pt-3 sm:pt-7">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px w-9 bg-warm-accent" aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <h1 className={`font-heading font-medium tracking-[-0.055em] text-brand ${allBooks.length ? "text-5xl leading-none sm:text-6xl" : "max-w-[15ch] text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.95]"}`}>
            {t("title")}
          </h1>
          <p className="mt-5 max-w-[38rem] text-base leading-8 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <p className="mt-5 font-heading text-2xl font-light italic tracking-[0.12em] text-brand">
            {t("motto")}
          </p>
        </div>
      </section>

      {databaseReady && <HomeDashboard books={allBooks} />}

      <section id="library" aria-labelledby="shelf-title" className="mt-14 scroll-mt-6 sm:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <BookOpenText className="size-4 text-brand" aria-hidden="true" />{t("shelfLabel")}
            </div>
            <h2 id="shelf-title" className="mt-5 font-heading text-4xl font-medium leading-none tracking-tight text-brand sm:text-5xl">{t(allBooks.length ? "shelfTitlePopulated" : "shelfTitle")}</h2>
          </div>
          {owner && databaseReady && <Link href="/books/new" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"><Plus className="size-4" aria-hidden="true" />{booksT("add")}</Link>}
        </div>

        {databaseReady && <form method="get" className="mt-8 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(4,auto)]">
          <label className="sr-only" htmlFor="book-search">{booksT("filters.search")}</label>
          <input id="book-search" name="q" type="search" maxLength={100} defaultValue={search} placeholder={booksT("filters.search")} className="h-10 min-w-0 rounded-lg border border-input bg-field px-3 text-sm outline-none sm:col-span-2 lg:col-span-1" />
          <label className="sr-only" htmlFor="ownership-filter">{booksT("filters.ownership")}</label>
          <Select id="ownership-filter" name="ownership" defaultValue={filter.ownership ?? ""} containerClassName="min-w-44">
            <option value="">{booksT("filters.allOwnership")}</option>
            <option value="OWNED">{booksT("form.owned")}</option>
            <option value="WISHLIST">{booksT("form.wishlist")}</option>
          </Select>
          <label className="sr-only" htmlFor="reading-filter">{booksT("filters.reading")}</label>
          <Select id="reading-filter" name="reading" defaultValue={filter.reading ?? ""} containerClassName="min-w-44">
            <option value="">{booksT("filters.allReading")}</option>
            <option value="WANT_TO_READ">{booksT("form.wantToRead")}</option>
            <option value="READING">{booksT("form.readingNow")}</option>
            <option value="READ">{booksT("form.read")}</option>
            <option value="ABANDONED">{booksT("form.abandoned")}</option>
          </Select>
          <label className="sr-only" htmlFor="stage-filter">{booksT("filters.stage")}</label>
          <Select id="stage-filter" name="stage" defaultValue={filter.stage ?? ""} containerClassName="min-w-44">
            <option value="">{booksT("filters.allStages")}</option>
            {greatWorkStages.map((stage) => <option key={stage} value={stage}>{greatT(`stages.${stage}.name`)}</option>)}
          </Select>
          <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">{booksT("filters.apply")}</button>
        </form>}

        {books.length ? <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => <BookCard key={book.id} book={book} label={book.ownershipStatus === "WISHLIST" ? booksT("form.wishlist") : booksT(`form.${({ WANT_TO_READ: "wantToRead", READING: "readingNow", READ: "read", ABANDONED: "abandoned" } as const)[book.readingStatus]}`)} />)}
        </div> : <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-10 sm:px-10">
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{!databaseReady ? booksT("databaseUnavailable") : hasFilter ? booksT("noResults") : t("shelfDescription")}</p>
          {hasFilter && <Link href="/" className="mt-4 inline-block text-sm text-brand underline decoration-warm-accent underline-offset-4">{booksT("filters.clear")}</Link>}
        </div>}
      </section>
    </main>
  );
}
