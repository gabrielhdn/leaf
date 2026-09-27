import { BookCover } from "@/components/leaf/book-cover";
import { Link } from "@/i18n/navigation";

type BookCardData = {
  id: string;
  title: string;
  coverUrl: string | null;
  authors: { author: { name: string } }[];
};

export function BookCard({ book, label }: { book: BookCardData; label?: string }) {
  return (
    <Link href={`/books/${book.id}`} className="group min-w-0">
      <BookCover title={book.title} coverUrl={book.coverUrl} className="transition-transform group-hover:-translate-y-1" />
      <h3 className="mt-3 line-clamp-2 font-heading text-2xl font-medium leading-tight text-brand group-hover:underline">{book.title}</h3>
      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{book.authors.map(({ author }) => author.name).join(", ")}</p>
      {label && <p className="mt-2 text-xs text-muted-foreground">{label}</p>}
    </Link>
  );
}
