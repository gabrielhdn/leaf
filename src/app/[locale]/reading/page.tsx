import { getTranslations } from "next-intl/server";
import { BookCard } from "@/components/leaf/book-card";
import { getGreatWorkStage, readingStatuses } from "@/domain/reading-journey";
import { listBooks } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const t = await getTranslations("ReadingView");
  const greatT = await getTranslations("GreatWork");
  const books = process.env.DATABASE_URL ? await listBooks() : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-7xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t("description")}</p>
      {!process.env.DATABASE_URL ? <p className="mt-9 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">{t("databaseUnavailable")}</p> :
        <div className="mt-10 space-y-12">
          {readingStatuses.map((status) => {
            const group = books.filter((book) => book.readingStatus === status);
            return <section key={status} aria-labelledby={`reading-${status}`}>
              <div className="flex items-baseline gap-3 border-b border-border pb-3">
                <h2 id={`reading-${status}`} className="font-heading text-4xl text-brand">{t(`groups.${status}`)}</h2>
                <span className="text-sm text-muted-foreground">{group.length}</span>
              </div>
              {group.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                {group.map((book) => {
                  const stage = getGreatWorkStage(book);
                  return <BookCard key={book.id} book={book} label={stage ? greatT(`stages.${stage}.name`) : undefined} />;
                })}
              </div> : <p className="mt-5 text-sm text-muted-foreground">{t("emptyGroup")}</p>}
            </section>;
          })}
        </div>}
    </main>
  );
}
