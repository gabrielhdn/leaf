import Image from "next/image";
import { BookOpen } from "lucide-react";

export function BookCover({
  title,
  coverUrl,
  className = "",
}: {
  title: string;
  coverUrl: string | null;
  className?: string;
}) {
  return (
    <div className={`relative flex aspect-[2/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary ${className}`}>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-cover"
        />
      ) : (
        <BookOpen className="size-12 text-brand/50" aria-hidden="true" />
      )}
    </div>
  );
}
