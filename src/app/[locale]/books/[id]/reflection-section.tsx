import type { Book, BookNote, Quote, ReadingReflection } from "@/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { assimilateBook } from "../reflection-actions";
import { ReflectionForm } from "../reflection-form";

type Props = {
  book: Book;
  reflection: ReadingReflection | null;
  quotes: Quote[];
  notes: BookNote[];
  owner: boolean;
  locale: string;
};

export async function ReflectionSection({ book, reflection, quotes, notes, owner, locale }: Props) {
  if (book.readingStatus !== "READ") return null;

  const t = await getTranslations("Reflection");
  const assimilated = Boolean(book.assimilatedAt);
  const favoriteQuotes = quotes.filter((quote) => quote.isFavorite);

  return (
    <section id="reflection" aria-labelledby="reflection-title" className="mt-12 scroll-mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{assimilated ? t("rubedoEyebrow") : t("citrinitasEyebrow")}</p>
      <h2 id="reflection-title" className="mt-2 font-heading text-4xl text-brand sm:text-5xl">{assimilated ? t("rubedoTitle") : t("citrinitasTitle")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{assimilated ? t("rubedoDescription") : t("citrinitasDescription")}</p>

      {(book.rating || reflection?.content || reflection?.keyIdeas.length) && <div className="mt-7 space-y-6 border-t border-border pt-6">
        {book.rating && <div><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("ratingLabel")}</h3><p className="mt-2 font-heading text-3xl text-brand">{book.rating}/5</p></div>}
        {reflection?.content && <div><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("contentLabel")}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-8">{reflection.content}</p></div>}
        {reflection?.keyIdeas.length ? <div><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("ideasLabel")}</h3><ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-7">{reflection.keyIdeas.map((idea, index) => <li key={index} className="whitespace-pre-wrap">{idea}</li>)}</ul></div> : null}
      </div>}

      {assimilated && <div className="mt-7 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <h3 className="font-heading text-3xl text-brand">{t("favoriteQuotes")}</h3>
          {favoriteQuotes.length ? <ul className="mt-3 space-y-3">{favoriteQuotes.slice(0, 3).map((quote) => <li key={quote.id}><a href={`#quote-${quote.id}`} className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground hover:text-foreground">{quote.content}</a></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">{t("noFavoriteQuotes")}</p>}
          {favoriteQuotes.length > 3 && <a href="#quotes" className="mt-3 inline-block text-sm text-brand transition-opacity duration-200 hover:opacity-80">{t("seeAllQuotes")}</a>}
        </div>
        <div>
          <h3 className="font-heading text-3xl text-brand">{t("readingNotes")}</h3>
          {notes.length ? <ul className="mt-3 space-y-3">{notes.slice(0, 3).map((note) => <li key={note.id}><a href={`#note-${note.id}`} className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground hover:text-foreground">{note.content}</a></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">{t("noNotes")}</p>}
          {notes.length > 3 && <a href="#notes" className="mt-3 inline-block text-sm text-brand transition-opacity duration-200 hover:opacity-80">{t("seeAllNotes")}</a>}
        </div>
      </div>}

      {owner && <div className="mt-8 border-t border-border pt-6">
        <details>
          <summary className="cursor-pointer text-sm font-medium text-brand">{reflection ? t("edit") : t("add")}</summary>
          <ReflectionForm bookId={book.id} locale={locale} content={reflection?.content ?? null} keyIdeas={reflection?.keyIdeas ?? []} rating={book.rating} />
        </details>
        {!assimilated && <form action={assimilateBook} className="mt-6">
          <input type="hidden" name="bookId" value={book.id} /><input type="hidden" name="locale" value={locale} />
          <p className="mb-3 text-xs leading-6 text-muted-foreground">{t("optional")}</p>
          <Button type="submit" size="lg">{t("assimilate")}</Button>
        </form>}
      </div>}
    </section>
  );
}
