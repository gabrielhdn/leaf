"use client";

import { Check, ChevronDown, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState, useTransition } from "react";
import { findCategories, removeCategory, renameCategory, type CategoryMutationResult } from "@/app/[locale]/books/category-actions";
import type { CategoryOption } from "@/domain/categories";
import { Input } from "@/components/ui/input";
import { useAnimatedDisclosure } from "./use-animated-disclosure";

function CategoryRow({ category, onChanged }: { category: CategoryOption; onChanged: (previous: string, next?: string) => void }) {
  const t = useTranslations("Categories");
  const [name, setName] = useState(category.name);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<CategoryMutationResult["error"] | "saveError">(null);
  const [pending, startTransition] = useTransition();

  function mutate(remove: boolean) {
    startTransition(async () => {
      try {
        const result = remove ? await removeCategory(category.id) : await renameCategory(category.id, name);
        setError(result.error);
        if (!result.error) onChanged(category.name, remove ? undefined : name);
      } catch { setError("saveError"); }
    });
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <Input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); if (name.trim() && name !== category.name && !pending) mutate(false); } }} maxLength={100} aria-label={t("rename", { name: category.name })} disabled={pending} />
        <button type="button" onClick={() => mutate(false)} disabled={pending || name === category.name || !name.trim()} aria-label={t("save")} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-brand hover:bg-muted/40 disabled:opacity-40"><Check className="size-4" aria-hidden="true" /></button>
        <button type="button" onClick={() => setConfirm(true)} disabled={pending} aria-label={t("delete", { name: category.name })} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-40"><Trash2 className="size-4" aria-hidden="true" /></button>
      </div>
      <p className="text-xs text-muted-foreground">{t("bookCount", { count: category.bookCount })}</p>
      {confirm && <div className="space-y-2">
        <p className="text-xs leading-5 text-muted-foreground">{t("deleteHelp")}</p>
        <div className="flex gap-2">
          <button type="button" disabled={pending} onClick={() => mutate(true)} className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20">{t("confirmDelete")}</button>
          <button type="button" disabled={pending} onClick={() => setConfirm(false)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted/40"><X className="size-3" aria-hidden="true" />{t("cancel")}</button>
        </div>
      </div>}
      {error && <p role="alert" className="text-xs text-destructive">{t(error)}</p>}
    </div>
  );
}

export function CategoryManager({ onChanged }: { onChanged: (previous: string, next?: string) => void }) {
  const t = useTranslations("Categories");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CategoryOption[]>([]);
  const [revision, setRevision] = useState(0);
  const { open, panelRef, toggle } = useAnimatedDisclosure();
  const panelId = useId();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      findCategories(query).then((result) => {
        if (active) { setItems(result); setError(false); }
      }).catch(() => { if (active) setError(true); });
    }, 200);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [query, revision]);

  return (
    <div className="rounded-lg border border-border p-3">
      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={panelId} className="flex w-full items-center justify-between gap-3 rounded text-sm font-medium text-brand hover:opacity-80">
        {t("manage")}<ChevronDown className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div ref={panelRef} id={panelId} aria-hidden={!open} inert={!open} className="overflow-hidden" style={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}>
        <div className="space-y-3 pt-4">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }} maxLength={100} aria-label={t("search")} placeholder={t("search")} />
        <p className="text-xs leading-5 text-muted-foreground">{t("manageHelp")}</p>
        {items.map((category) => <CategoryRow key={`${category.id}:${category.name}`} category={category} onChanged={(previous, next) => {
          onChanged(previous, next);
          setRevision((value) => value + 1);
        }} />)}
        {!items.length && <p className="text-sm text-muted-foreground">{t("noMatches")}</p>}
        {error && <p role="alert" className="text-xs text-destructive">{t("loadError")}</p>}
        </div>
      </div>
    </div>
  );
}
