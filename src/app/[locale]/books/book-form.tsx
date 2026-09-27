"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BookInput } from "@/domain/book-input";
import { submitBook, type BookFormState } from "./actions";

const initialState: BookFormState = { error: null };
const fieldClass = "h-11 bg-background px-3";
const textareaClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function BookForm({
  locale,
  id,
  initial,
}: {
  locale: string;
  id?: string;
  initial?: BookInput;
}) {
  const t = useTranslations("Books.form");
  const [state, action, pending] = useActionState(submitBook.bind(null, id ?? null), initialState);

  return (
    <form action={action} className="space-y-7">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">{t("title")}</label>
          <Input id="title" name="title" required maxLength={300} defaultValue={initial?.title} className={fieldClass} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="authors" className="text-sm font-medium">{t("authors")}</label>
          <textarea id="authors" name="authors" required rows={3} maxLength={2000} defaultValue={initial?.authors.join("\n")} className={textareaClass} aria-describedby="authors-help" />
          <p id="authors-help" className="text-xs text-muted-foreground">{t("authorsHelp")}</p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">{t("description")}</label>
          <textarea id="description" name="description" rows={4} maxLength={20000} defaultValue={initial?.description} className={textareaClass} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="coverUrl" className="text-sm font-medium">{t("coverUrl")}</label>
          <Input id="coverUrl" name="coverUrl" type="url" defaultValue={initial?.coverUrl} className={fieldClass} placeholder="https://" />
        </div>
        <div className="space-y-2">
          <label htmlFor="isbn" className="text-sm font-medium">{t("isbn")}</label>
          <Input id="isbn" name="isbn" maxLength={32} defaultValue={initial?.isbn} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="publicationYear" className="text-sm font-medium">{t("publicationYear")}</label>
          <Input id="publicationYear" name="publicationYear" type="number" min={1450} max={3000} defaultValue={initial?.publicationYear} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="pageCount" className="text-sm font-medium">{t("pageCount")}</label>
          <Input id="pageCount" name="pageCount" type="number" min={1} defaultValue={initial?.pageCount} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="rating" className="text-sm font-medium">{t("rating")}</label>
          <select id="rating" name="rating" defaultValue={initial?.rating ?? ""} className={`${fieldClass} w-full rounded-lg border border-input text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}>
            <option value="">{t("noRating")}</option>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="ownershipStatus" className="text-sm font-medium">{t("ownership")}</label>
          <select id="ownershipStatus" name="ownershipStatus" defaultValue={initial?.ownershipStatus ?? "OWNED"} className={`${fieldClass} w-full rounded-lg border border-input text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}>
            <option value="OWNED">{t("owned")}</option>
            <option value="WISHLIST">{t("wishlist")}</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="readingStatus" className="text-sm font-medium">{t("reading")}</label>
          <select id="readingStatus" name="readingStatus" defaultValue={initial?.readingStatus ?? "WANT_TO_READ"} className={`${fieldClass} w-full rounded-lg border border-input text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}>
            <option value="WANT_TO_READ">{t("wantToRead")}</option>
            <option value="READING">{t("readingNow")}</option>
            <option value="READ">{t("read")}</option>
            <option value="ABANDONED">{t("abandoned")}</option>
          </select>
        </div>
      </div>

      {state.error && <p role="alert" className="text-sm text-destructive">{t(state.error)}</p>}
      <Button type="submit" size="lg" disabled={pending}>{pending ? t("saving") : t("save")}</Button>
    </form>
  );
}
