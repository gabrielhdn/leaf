import { getTranslations } from "next-intl/server";
import { BookCard } from "@/components/leaf/book-card";
import { getGreatWorkStage, greatWorkStages } from "@/domain/reading-journey";
import { Link } from "@/i18n/navigation";
import { listBooks } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function GreatWorkPage() {
  const t = await getTranslations("GreatWork");
  const books = process.env.DATABASE_URL ? await listBooks() : [];
  const abandoned = books.filter((book) => book.readingStatus === "ABANDONED");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-7xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t("overviewDescription")}</p>
      {!process.env.DATABASE_URL ? <p className="mt-9 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">{t("databaseUnavailable")}</p> :
        <div className="mt-10 space-y-14">
          {greatWorkStages.map((stage, index) => {
            const group = books.filter((book) => getGreatWorkStage(book) === stage);
            return <section id={stage.toLowerCase()} key={stage} aria-labelledby={`heading-${stage}`} className="scroll-mt-8">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t("step", { number: index + 1 })}</p>
                  <h2 id={`heading-${stage}`} className="mt-2 font-heading text-4xl text-brand sm:text-5xl">{t(`stages.${stage}.name`)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`stages.${stage}.subtitle`)} · {t("bookCount", { count: group.length })}</p>
                </div>
                <Link href={`/?stage=${stage}`} className="text-sm text-brand underline decoration-warm-accent underline-offset-4">{t("browseStage")}</Link>
              </div>
              {group.length ? <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
                {group.map((book) => <BookCard key={book.id} book={book} />)}
              </div> : <p className="mt-5 text-sm text-muted-foreground">{t("emptyStage")}</p>}
            </section>;
          })}
          {abandoned.length > 0 && <section aria-labelledby="abandoned-heading" className="border-t border-border pt-8">
            <h2 id="abandoned-heading" className="font-heading text-4xl text-brand">{t("abandonedTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("abandonedDescription")}</p>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
              {abandoned.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          </section>}
        </div>}
    </main>
  );
}
