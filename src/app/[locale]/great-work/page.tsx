import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookCard } from "@/components/leaf/book-card";
import { BookCover } from "@/components/leaf/book-cover";
import { getGreatWorkStage, greatWorkStages } from "@/domain/reading-journey";
import { Link } from "@/i18n/navigation";
import { listBooks } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function GreatWorkPage() {
  const t = await getTranslations("GreatWork");
  const databaseReady = Boolean(process.env.DATABASE_URL);
  const books = databaseReady ? await listBooks() : [];
  const abandoned = books.filter((book) => book.readingStatus === "ABANDONED");

  return (
    <main className="mx-auto w-full max-w-[100rem] px-5 pb-16 pt-9 sm:px-8 lg:px-12">
      <header className="max-w-6xl">
        <h1 className="font-heading text-6xl font-medium leading-none text-brand sm:text-7xl">{t("title")}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{t("overviewDescription")}</p>
        <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{t("overviewReading")}</p>
      </header>

      {!databaseReady && <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">{t("databaseUnavailable")}</p>}

      <div className="mt-6 space-y-2">
        {greatWorkStages.map((stage) => {
          const group = books.filter((book) => getGreatWorkStage(book) === stage);
          const stageLink = `/?stage=${stage}`;

          return (
            <section
              id={stage.toLowerCase()}
              key={stage}
              data-stage={stage}
              aria-labelledby={`heading-${stage}`}
              className="great-work-card scroll-mt-8 grid gap-5 rounded-2xl p-4 sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_8rem_minmax(0,1fr)] lg:items-stretch lg:gap-0"
            >
              <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-5 lg:pr-6">
                <Image
                  src={`/great-work/${stage.toLowerCase()}.webp`}
                  alt=""
                  width={480}
                  height={480}
                  className="great-work-symbol size-[5.5rem] self-center justify-self-center object-contain sm:row-span-2 sm:size-32"
                />
                <div className="min-w-0 self-end">
                  <p className="text-xs font-medium uppercase tracking-[0.13em] text-[var(--stage-accent)]">{t(`stages.${stage}.ordinal`)}</p>
                  <h2 id={`heading-${stage}`} className="mt-0.5 font-heading text-4xl font-medium leading-none sm:text-5xl">{t(`stages.${stage}.name`)}</h2>
                  <p className="mt-2 font-heading text-lg italic leading-5 sm:text-[1.4rem] sm:leading-6">{t(`stages.${stage}.alchemy`)}</p>
                </div>
                <p className="col-span-2 mt-3 text-sm leading-6 text-[var(--stage-muted)] sm:col-span-1 sm:mt-2 sm:text-base">{t(`stages.${stage}.journeyDescription`)}</p>
              </div>

              <div className="flex items-baseline gap-2 border-t border-[var(--stage-divider)] pt-3 lg:flex-col lg:items-center lg:justify-center lg:gap-0 lg:border-x lg:border-t-0 lg:px-3 lg:py-4">
                <span className="text-5xl font-light leading-none sm:text-6xl">{group.length}</span>
                <span className="text-base text-[var(--stage-muted)]">{t("bookCount", { count: group.length })}</span>
              </div>

              <div className="min-w-0 border-t border-[var(--stage-divider)] pt-3 lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-xl font-semibold leading-none">{t("booksInStage")}</h3>
                  <Link href={stageLink} className="shrink-0 text-sm font-medium text-[var(--stage-accent)] transition-opacity duration-200 hover:opacity-80">
                    {t("browseStage")} ({group.length})
                  </Link>
                </div>
                {group.length > 0 ? (
                  <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <div className="grid min-w-0 grid-cols-3 gap-3">
                      {group.slice(0, 3).map((book) => (
                        <Link key={book.id} href={`/books/${book.id}`} className="group min-w-0 text-center">
                          <BookCover title={book.title} coverUrl={book.coverUrl} className="mx-auto w-full max-w-20 shadow-sm transition-opacity duration-200 group-hover:opacity-95" />
                          <p className="mt-1 line-clamp-2 font-heading text-base font-semibold leading-4 transition-opacity duration-200 group-hover:opacity-80">{book.title}</p>
                          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-[var(--stage-muted)]">{book.authors.map(({ author }) => author.name).join(", ")}</p>
                        </Link>
                      ))}
                    </div>
                    <Link href={stageLink} aria-label={t("browseStage")} className="flex size-9 items-center justify-center rounded-full bg-white/60 text-[var(--stage-accent)] transition-colors hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                ) : <p className="mt-4 text-sm leading-6 text-[var(--stage-muted)]">{t("emptyStage")}<br />{t("emptyStagePrompt")}</p>}
              </div>
            </section>
          );
        })}
      </div>

      {abandoned.length > 0 && (
        <section aria-labelledby="abandoned-heading" className="mt-10 border-t border-border pt-8">
          <h2 id="abandoned-heading" className="font-heading text-4xl text-brand">{t("abandonedTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("abandonedDescription")}</p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {abandoned.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </section>
      )}
    </main>
  );
}
