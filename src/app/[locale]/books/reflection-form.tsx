"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitReflection, type ReflectionFormState } from "./reflection-actions";

const initialState: ReflectionFormState = { error: null };

export function ReflectionForm({
  bookId,
  locale,
  content,
  keyIdeas,
  rating,
}: {
  bookId: string;
  locale: string;
  content: string | null;
  keyIdeas: string[];
  rating: number | null;
}) {
  const t = useTranslations("Reflection");
  const [state, action, pending] = useActionState(submitReflection, initialState);

  return (
    <form action={action} className="mt-6 space-y-5 rounded-xl border border-border bg-background p-5 sm:p-6">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label htmlFor="reflection-content" className="text-sm font-medium">{t("contentLabel")}</label>
        <textarea id="reflection-content" name="content" rows={6} maxLength={20_000} defaultValue={content ?? ""} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm leading-7 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
      </div>
      <div className="space-y-2">
        <label htmlFor="reflection-ideas" className="text-sm font-medium">{t("ideasLabel")}</label>
        <textarea id="reflection-ideas" name="keyIdeas" rows={4} defaultValue={keyIdeas.join("\n")} className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm leading-7 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
        <p className="text-xs text-muted-foreground">{t("ideasHelp")}</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="reflection-rating" className="text-sm font-medium">{t("ratingLabel")}</label>
        <select id="reflection-rating" name="rating" defaultValue={rating ?? ""} className="h-9 w-32 rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">{t("noRating")}</option>
          {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}
        </select>
      </div>
      {state.error && <p role="alert" className="text-sm text-destructive">{t(state.error)}</p>}
      <Button type="submit" disabled={pending} size="lg">{pending ? t("saving") : t("save")}</Button>
    </form>
  );
}
