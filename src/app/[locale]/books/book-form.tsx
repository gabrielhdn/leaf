"use client";

import { BookOpen, Check, Heart, LibraryBig, Pause, Star, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { BookCover } from "@/components/leaf/book-cover";
import { CategoryManager } from "@/components/leaf/category-manager";
import { CategoryPicker } from "@/components/leaf/category-picker";
import { NamePicker } from "@/components/leaf/name-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BookInput } from "@/domain/book-input";
import { categoryKey } from "@/domain/categories";
import { submitBook, type BookFormState } from "./actions";
import { findAuthors } from "./author-actions";

const initialState: BookFormState = { error: null };
const fieldClass = "h-11 px-3";
const textareaClass = "w-full rounded-lg border border-input bg-field px-3 py-2 text-sm outline-none";

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5">
    <div><h3 className="font-heading text-2xl font-semibold text-brand">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div>
    {children}
  </section>;
}

function ChoiceGroup({ name, label, value, options }: {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string; icon: LucideIcon; iconClass?: string }[];
}) {
  return <fieldset className="min-w-0 space-y-2">
    <legend className="text-sm font-medium">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map(({ value: option, label: text, icon: Icon, iconClass }) => <label key={option} className="relative cursor-pointer">
        <input type="radio" name={name} value={option} defaultChecked={value === option} className="peer sr-only" />
        <span className="flex min-h-10 items-center gap-2 rounded-lg border border-border bg-field px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 peer-checked:border-ring/60 peer-checked:bg-navigation-active peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"><Icon aria-hidden="true" className={`size-4 ${iconClass ?? "text-brand"}`} />{text}</span>
      </label>)}
    </div>
  </fieldset>;
}

function safeCoverUrl(value: string): string | null {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? value : null; }
  catch { return null; }
}

export function BookForm({ locale, id, initial, onSaved, onCancel }: {
  locale: string;
  id?: string;
  initial?: BookInput;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("Books.form");
  const categoryT = useTranslations("Categories");
  const [state, action, pending] = useActionState(submitBook.bind(null, id ?? null), initialState);
  const [categories, setCategories] = useState(initial?.categories ?? []);
  const [authors, setAuthors] = useState(initial?.authors ?? []);
  const [categoryRevision, setCategoryRevision] = useState(0);
  const [rating, setRating] = useState(initial?.rating ?? null);
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");

  useEffect(() => { if (state.savedId) onSaved(); }, [state.savedId, onSaved]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <FormSection title={t("sections.main")} description={t("sections.mainDescription")}>
        <div className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
          <div className="mx-auto w-24 sm:row-span-2 sm:w-full"><BookCover title={t("coverPreview")} coverUrl={safeCoverUrl(coverUrl)} /></div>
          <div className="space-y-2"><label htmlFor="title" className="text-sm font-medium">{t("title")} <span className="text-destructive" aria-hidden="true">*</span></label><Input id="title" name="title" required maxLength={300} defaultValue={initial?.title} className={fieldClass} /></div>
          <fieldset className="space-y-2"><legend className="text-sm font-medium">{t("authors")} <span className="text-destructive" aria-hidden="true">*</span></legend><NamePicker value={authors} onChange={setAuthors} name="authors" namespace="Authors" loadOptions={findAuthors} maxLength={200} required /></fieldset>
        </div>
        <div className="space-y-2"><label htmlFor="coverUrl" className="text-sm font-medium">{t("coverUrl")}</label><Input id="coverUrl" name="coverUrl" type="url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} className={fieldClass} placeholder="https://" /></div>
        <div className="space-y-2"><label htmlFor="description" className="text-sm font-medium">{t("description")}</label><textarea id="description" name="description" rows={4} maxLength={20000} defaultValue={initial?.description} className={textareaClass} /></div>
      </FormSection>
      <FormSection title={t("sections.organization")} description={t("sections.organizationDescription")}>
        <div className="space-y-2"><p className="text-sm font-medium">{categoryT("title")}</p><CategoryPicker value={categories} onChange={setCategories} revision={categoryRevision} /></div>
        <CategoryManager onChanged={(previous, next) => {
          setCategories((values) => [...new Map(values.flatMap((value) => categoryKey(value) === categoryKey(previous) ? next ? [next] : [] : [value]).map((value) => [categoryKey(value), value])).values()]);
          setCategoryRevision((value) => value + 1);
        }} />
      </FormSection>
      <FormSection title={t("sections.metadata")} description={t("sections.metadataDescription")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="isbn" className="text-sm font-medium">{t("isbn")}</label><Input id="isbn" name="isbn" maxLength={32} defaultValue={initial?.isbn} className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="publicationYear" className="text-sm font-medium">{t("publicationYear")}</label><Input id="publicationYear" name="publicationYear" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} defaultValue={initial?.publicationYear} className={fieldClass} /></div>
        </div>
      </FormSection>
      <FormSection title={t("sections.progress")} description={t("sections.progressDescription")}>
        <ChoiceGroup name="readingStatus" label={t("reading")} value={initial?.readingStatus ?? "WANT_TO_READ"} options={[
          { value: "WANT_TO_READ", label: t("wantToRead"), icon: BookOpen, iconClass: "text-warm-accent" },
          { value: "READING", label: t("readingNow"), icon: BookOpen },
          { value: "READ", label: t("read"), icon: Check },
          { value: "ABANDONED", label: t("abandoned"), icon: Pause, iconClass: "text-muted-foreground" },
        ]} />
        <ChoiceGroup name="ownershipStatus" label={t("ownership")} value={initial?.ownershipStatus ?? "OWNED"} options={[
          { value: "OWNED", label: t("owned"), icon: LibraryBig },
          { value: "WISHLIST", label: t("wishlist"), icon: Heart, iconClass: "text-warm-accent" },
        ]} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="pageCount" className="text-sm font-medium">{t("pageCount")}</label><Input id="pageCount" name="pageCount" type="text" inputMode="numeric" pattern="[0-9]*" defaultValue={initial?.pageCount} className={fieldClass} /></div>
          <div className="space-y-2"><label htmlFor="currentPage" className="text-sm font-medium">{t("currentPage")}</label><Input id="currentPage" name="currentPage" type="text" inputMode="numeric" pattern="[0-9]*" defaultValue={initial?.currentPage ?? ""} className={fieldClass} /></div>
        </div>
        <fieldset className="space-y-2"><legend className="text-sm font-medium">{t("rating")}</legend>
          <input type="hidden" name="rating" value={rating ?? ""} />
          <div className="flex flex-wrap items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={t("rate", { value })} aria-pressed={rating === value} onClick={() => setRating(rating === value ? null : value)} className="flex size-10 items-center justify-center rounded-lg text-warm-accent transition-opacity hover:opacity-70"><Star className="size-6" aria-hidden="true" fill={rating !== null && value <= rating ? "currentColor" : "none"} /></button>)}
            <button type="button" onClick={() => setRating(null)} className="ml-2 text-xs text-muted-foreground hover:text-foreground">{t("noRating")}</button>
          </div>
        </fieldset>
      </FormSection>
      {state.error && <p role="alert" className="text-sm text-destructive">{t(state.error)}</p>}
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-background py-4">
        <Button type="button" variant="ghost" size="lg" onClick={onCancel} disabled={pending}>{t("cancel")}</Button>
        <Button type="submit" size="lg" disabled={pending}>{pending ? t("saving") : t("save")}</Button>
      </div>
    </form>
  );
}
