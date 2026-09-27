"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReadingEntryKind } from "@/domain/reading-entry";
import { saveReadingEntry, type ReadingEntryFormState } from "./reading-actions";

const initialState: ReadingEntryFormState = { error: null };

export function ReadingEntryForm({
  kind,
  bookId,
  locale,
  id,
  content,
  page,
}: {
  kind: ReadingEntryKind;
  bookId: string;
  locale: string;
  id?: string;
  content?: string;
  page?: number | null;
}) {
  const t = useTranslations("ReadingEntries");
  const [state, action, pending] = useActionState(
    saveReadingEntry.bind(null, kind, bookId, id ?? null),
    initialState,
  );
  const contentId = `${kind}-content-${id ?? "new"}`;
  const pageId = `${kind}-page-${id ?? "new"}`;

  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label htmlFor={contentId} className="text-sm font-medium">{kind === "quote" ? t("quote.content") : t("note.content")}</label>
        <textarea
          id={contentId}
          name="content"
          required
          rows={4}
          maxLength={20_000}
          defaultValue={content}
          aria-invalid={state.error === "invalid"}
          className="w-full rounded-lg border border-input bg-field px-3 py-2 text-sm leading-7 outline-none"
        />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-28 space-y-2">
          <label htmlFor={pageId} className="text-sm font-medium">{t("pageLabel")}</label>
          <Input id={pageId} name="page" type="number" min={1} max={2_147_483_647} defaultValue={page ?? ""} className="h-9" />
        </div>
        <Button type="submit" disabled={pending} size="lg">{pending ? t("saving") : t("save")}</Button>
      </div>
      {state.error && <p role="alert" className="text-sm text-destructive">{t(state.error)}</p>}
    </form>
  );
}
