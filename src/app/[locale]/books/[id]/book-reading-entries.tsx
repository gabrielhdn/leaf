import { Star } from "lucide-react";
import type { BookNote, Quote } from "@/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ReadingEntryDeleteButton } from "../reading-entry-delete-button";
import { ReadingEntryForm } from "../reading-entry-form";
import { deleteReadingEntry, toggleQuoteFavorite } from "../reading-actions";

type Props = {
  bookId: string;
  locale: string;
  owner: boolean;
  quotes: Quote[];
  notes: BookNote[];
};

export async function BookReadingEntries({ bookId, locale, owner, quotes, notes }: Props) {
  const t = await getTranslations("ReadingEntries");
  const dateFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-2">
      <section id="quotes" aria-labelledby="quotes-title" className="scroll-mt-8">
        <div className="border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("quote.eyebrow")}</p>
          <h2 id="quotes-title" className="mt-2 font-heading text-4xl text-brand">{t("quote.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("quote.description")}</p>
        </div>
        {owner && <details className="mt-6 rounded-xl border border-border bg-card p-5 open:pb-6">
          <summary className="cursor-pointer text-sm font-medium text-brand">{t("quote.add")}</summary>
          <ReadingEntryForm kind="quote" bookId={bookId} locale={locale} />
        </details>}
        {quotes.length === 0 && <p className="mt-6 text-sm text-muted-foreground">{t("quote.empty")}</p>}
        <div className="mt-6 space-y-4">
          {quotes.map((quote) => <article key={quote.id} id={`quote-${quote.id}`} className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <blockquote className="whitespace-pre-wrap font-heading text-2xl leading-snug text-brand sm:text-[1.7rem]">{quote.content}</blockquote>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {quote.page && <span>{t("page", { page: quote.page })}</span>}
              <time dateTime={quote.createdAt.toISOString()}>{dateFormat.format(quote.createdAt)}</time>
              {quote.isFavorite && <span className="inline-flex items-center gap-1 text-brand"><Star className="size-3 fill-current" aria-hidden="true" />{t("quote.favorite")}</span>}
            </div>
            {owner && <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <form action={toggleQuoteFavorite}>
                <input type="hidden" name="id" value={quote.id} /><input type="hidden" name="bookId" value={bookId} /><input type="hidden" name="locale" value={locale} />
                <Button type="submit" variant="outline" size="sm" aria-pressed={quote.isFavorite}>{quote.isFavorite ? t("quote.unfavorite") : t("quote.markFavorite")}</Button>
              </form>
              <form action={deleteReadingEntry}>
                <input type="hidden" name="kind" value="quote" /><input type="hidden" name="id" value={quote.id} /><input type="hidden" name="bookId" value={bookId} /><input type="hidden" name="locale" value={locale} />
                <ReadingEntryDeleteButton />
              </form>
            </div>}
            {owner && <details className="mt-4"><summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">{t("edit")}</summary><ReadingEntryForm kind="quote" bookId={bookId} locale={locale} id={quote.id} content={quote.content} page={quote.page} /></details>}
          </article>)}
        </div>
      </section>

      <section id="notes" aria-labelledby="notes-title" className="scroll-mt-8">
        <div className="border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("note.eyebrow")}</p>
          <h2 id="notes-title" className="mt-2 font-heading text-4xl text-brand">{t("note.title")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("note.description")}</p>
        </div>
        {owner && <details className="mt-6 rounded-xl border border-border bg-card p-5 open:pb-6">
          <summary className="cursor-pointer text-sm font-medium text-brand">{t("note.add")}</summary>
          <ReadingEntryForm kind="note" bookId={bookId} locale={locale} />
        </details>}
        {notes.length === 0 && <p className="mt-6 text-sm text-muted-foreground">{t("note.empty")}</p>}
        <div className="mt-6 space-y-4">
          {notes.map((note) => <article key={note.id} id={`note-${note.id}`} className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <p className="whitespace-pre-wrap text-sm leading-7">{note.content}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {note.page && <span>{t("page", { page: note.page })}</span>}
              <time dateTime={note.createdAt.toISOString()}>{dateFormat.format(note.createdAt)}</time>
            </div>
            {owner && <div className="mt-5 border-t border-border pt-4">
              <form action={deleteReadingEntry}>
                <input type="hidden" name="kind" value="note" /><input type="hidden" name="id" value={note.id} /><input type="hidden" name="bookId" value={bookId} /><input type="hidden" name="locale" value={locale} />
                <ReadingEntryDeleteButton />
              </form>
              <details className="mt-4"><summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">{t("edit")}</summary><ReadingEntryForm kind="note" bookId={bookId} locale={locale} id={note.id} content={note.content} page={note.page} /></details>
            </div>}
          </article>)}
        </div>
      </section>
    </div>
  );
}
