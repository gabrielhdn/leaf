"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ReadingStatus } from "@/domain/reading-journey";
import { updateBookStatus, type BookStatusFormState } from "../actions";

const initialState: BookStatusFormState = { error: null };

export function BookStatusForm({
  id,
  locale,
  ownershipStatus,
  readingStatus,
  currentPage,
  pageCount,
}: {
  id: string;
  locale: string;
  ownershipStatus: "OWNED" | "WISHLIST";
  readingStatus: ReadingStatus;
  currentPage: number | null;
  pageCount: number | null;
}) {
  const t = useTranslations("Books");
  const [state, action, pending] = useActionState(updateBookStatus, initialState);

  return (
    <form action={action} className="mt-10 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 sm:items-end">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label htmlFor="detail-ownership" className="text-sm font-medium">{t("form.ownership")}</label>
        <Select id="detail-ownership" name="ownershipStatus" defaultValue={ownershipStatus} fieldSize="sm">
          <option value="OWNED">{t("form.owned")}</option>
          <option value="WISHLIST">{t("form.wishlist")}</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="detail-reading" className="text-sm font-medium">{t("form.reading")}</label>
        <Select id="detail-reading" name="readingStatus" defaultValue={readingStatus} fieldSize="sm">
          <option value="WANT_TO_READ">{t("form.wantToRead")}</option>
          <option value="READING">{t("form.readingNow")}</option>
          <option value="READ">{t("form.read")}</option>
          <option value="ABANDONED">{t("form.abandoned")}</option>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="detail-current-page" className="text-sm font-medium">{t("detail.currentPage")}</label>
        <Input
          id="detail-current-page"
          name="currentPage"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={currentPage ?? ""}
          aria-describedby="detail-current-page-help"
          aria-invalid={state.error === "invalidCurrentPage"}
          className="h-9 px-3"
        />
        <p id="detail-current-page-help" className="text-xs text-muted-foreground">
          {pageCount === null ? t("detail.currentPageNoTotal") : t("detail.currentPageHelp", { total: pageCount })}
        </p>
      </div>
      <button type="submit" disabled={pending} className="h-9 w-fit rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50">
        {pending ? t("form.saving") : t("detail.updateStatus")}
      </button>
      {state.error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{t(state.error === "invalidCurrentPage" ? "detail.invalidCurrentPage" : "form.invalid")}</p>}
    </form>
  );
}
