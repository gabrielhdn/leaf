import { ArrowRight, BookOpenText, Check, Heart, LibraryBig } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BookCover } from "@/components/leaf/book-cover";
import { getReadingProgress } from "@/domain/reading-progress";
import { getGreatWorkStage, greatWorkStages } from "@/domain/reading-journey";
import { Link } from "@/i18n/navigation";
import type { listBooks } from "@/lib/books";

type Book = Awaited<ReturnType<typeof listBooks>>[number];

export async function HomeDashboard({ books }: { books: Book[] }) {
  const t = await getTranslations("Home.dashboard");
  const greatT = await getTranslations("GreatWork");
  const readingBook = books.find((book) => book.readingStatus === "READING");
  const progress = readingBook ? getReadingProgress(readingBook.currentPage, readingBook.pageCount) : null;
  const stats = [
    { key: "library", label: t("stats.library"), count: books.filter((book) => book.ownershipStatus === "OWNED").length, href: "/#library", icon: LibraryBig, iconClass: "bg-secondary text-brand" },
    { key: "reading", label: t("stats.reading"), count: books.filter((book) => book.readingStatus === "READING").length, href: "/reading", icon: BookOpenText, iconClass: "bg-accent/20 text-brand" },
    { key: "completed", label: t("stats.completed"), count: books.filter((book) => book.readingStatus === "READ").length, href: "/?reading=READ#library", icon: Check, iconClass: "bg-secondary text-brand" },
    { key: "wishlist", label: t("stats.wishlist"), count: books.filter((book) => book.ownershipStatus === "WISHLIST").length, href: "/wishlist", icon: Heart, iconClass: "bg-accent/20 text-brand" },
  ] as const;

  return (
    <section aria-label={t("title")} className="mt-10">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ key, label, count, href, icon: Icon, iconClass }) => (
          <div key={key}>
            <Link href={href} className="group flex min-h-24 items-center gap-3 rounded-xl border border-border/80 bg-card px-4 py-3 transition-colors hover:border-brand/40 hover:bg-muted/40">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}><Icon className="size-5" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block font-heading text-3xl font-medium leading-none text-brand">{count}</span>
                <span className="mt-1 block text-xs leading-4 text-muted-foreground">{label}</span>
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8">
        <section aria-labelledby="currently-reading-heading" className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id="currently-reading-heading" className="font-heading text-2xl font-medium text-brand">{t("currentlyReading")}</h2>
            <Link href="/reading" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:underline">{t("seeAll")}<ArrowRight className="size-3" aria-hidden="true" /></Link>
          </div>
          {readingBook ? (
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 rounded-xl border border-border bg-card p-4 sm:flex sm:min-h-72 sm:gap-5">
              <Link href={`/books/${readingBook.id}`} className="group w-full self-start sm:w-44 sm:shrink-0">
                <BookCover title={readingBook.title} coverUrl={readingBook.coverUrl} className="w-full shadow-sm transition-transform group-hover:-translate-y-1" />
              </Link>
              <div className="contents sm:flex sm:min-w-0 sm:flex-1 sm:flex-col">
                <div className="min-w-0 self-center sm:self-auto">
                  <span className="text-xs font-medium text-muted-foreground">{t("inProgress")}</span>
                  <h3 className="mt-1 line-clamp-2 font-heading text-2xl font-medium leading-none text-brand sm:text-3xl"><Link href={`/books/${readingBook.id}`} className="hover:underline">{readingBook.title}</Link></h3>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{readingBook.authors.map(({ author }) => author.name).join(", ")}</p>
                </div>
                {progress !== null && readingBook.currentPage !== null && readingBook.pageCount !== null ? (
                  <div className="col-span-2 sm:mt-4">
                    <div className="flex items-center gap-3">
                      <div role="progressbar" aria-label={t("readingProgress")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-brand">{progress}%</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{t("pageProgress", { current: readingBook.currentPage, total: readingBook.pageCount })}</p>
                  </div>
                ) : <p className="col-span-2 text-xs leading-5 text-muted-foreground sm:mt-4">{t("progressUnavailable")}</p>}
                {readingBook.description && <p className="col-span-2 line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-muted-foreground sm:mt-3">{readingBook.description}</p>}
                <Link href={`/books/${readingBook.id}`} className="col-span-2 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80 sm:mt-auto sm:text-sm">{t("openBook")}<ArrowRight className="size-4" aria-hidden="true" /></Link>
              </div>
            </div>
          ) : (
            <div className="flex min-h-72 flex-col justify-center rounded-xl border border-border bg-card p-6">
              <BookOpenText className="size-7 text-brand" aria-hidden="true" />
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("noCurrentBook")}</p>
            </div>
          )}
        </section>

        <section aria-labelledby="journey-heading" className="min-w-0">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id="journey-heading" className="font-heading text-2xl font-medium text-brand">{t("journey")}</h2>
            <Link href="/great-work" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-brand hover:underline">{t("seeOverview")}<ArrowRight className="size-3" aria-hidden="true" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {greatWorkStages.map((stage) => {
              const count = books.filter((book) => getGreatWorkStage(book) === stage).length;
              return (
                <Link key={stage} href={`/great-work#${stage.toLowerCase()}`} data-stage={stage} className="great-work-card group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 transition-transform hover:-translate-y-0.5">
                  <div className="flex h-24 items-center justify-center bg-[var(--stage-background)]">
                    <Image src={`/great-work/${stage.toLowerCase()}.webp`} alt="" width={480} height={480} className="great-work-symbol size-20 object-contain" />
                  </div>
                  <div className="flex flex-1 flex-col border-t border-border/70 bg-card px-3 pb-3 pt-2 text-card-foreground">
                    <h3 className="font-heading text-xl font-semibold leading-none">{greatT(`stages.${stage}.name`)}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{t(`stages.${stage}.subtitle`)}</p>
                    <p className="mt-2 text-xs leading-4 text-muted-foreground">{t(`stages.${stage}.description`)}</p>
                    <p className="mt-auto pt-3 text-xs font-medium">{count} {greatT("bookCount", { count })}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
