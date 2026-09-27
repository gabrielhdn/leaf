import { getTranslations } from "next-intl/server";
import { BookCard } from "@/components/leaf/book-card";
import { listBooks } from "@/lib/books";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const t = await getTranslations("Wishlist");
  const books = process.env.DATABASE_URL ? await listBooks({ ownership: "WISHLIST" }) : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-7xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{t("description")}</p>
      {books.length ? <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {books.map((book) => <BookCard key={book.id} book={book} />)}
      </div> : <p className="mt-9 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">{process.env.DATABASE_URL ? t("empty") : t("databaseUnavailable")}</p>}
    </main>
  );
}
