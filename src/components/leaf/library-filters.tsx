"use client";

import { BookOpen, Check, ChevronDown, Eclipse, Flame, Heart, Layers, LibraryBig, Moon, Pause, Search, Sun, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BookFilter } from "@/lib/books";
import { useAnimatedDisclosure } from "./use-animated-disclosure";

type FilterOption = {
  value: string;
  label: string;
  icon: LucideIcon;
  iconClass?: string;
};

function FilterGroup({ name, legend, value, options, hideLegend = false }: {
  name: string;
  legend: string;
  value: string;
  options: FilterOption[];
  hideLegend?: boolean;
}) {
  return (
    <fieldset className={hideLegend ? "mt-3 min-w-0 lg:mt-0" : "min-w-0"}>
      <legend className={hideLegend ? "sr-only" : "mb-3 text-sm font-medium text-foreground"}>{legend}</legend>
      <div className={`flex flex-wrap gap-2 ${hideLegend ? "lg:flex-nowrap" : ""}`}>
        {options.map(({ value: optionValue, label, icon: Icon, iconClass }) => (
          <label key={optionValue} className="relative cursor-pointer">
            <input type="radio" name={name} value={optionValue} defaultChecked={value === optionValue} className="peer sr-only" />
            <span className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-border bg-field px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/40 peer-checked:border-ring/60 peer-checked:bg-navigation-active peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
              <Icon aria-hidden="true" className={`size-4 shrink-0 ${iconClass ?? "text-brand"}`} />
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LibraryFilters({ search, filter }: { search: string; filter: BookFilter }) {
  const t = useTranslations("Books");
  const greatT = useTranslations("GreatWork");
  const { open: expanded, panelRef, toggle } = useAnimatedDisclosure();

  return (
    <form method="get" className="mt-8 grid content-start items-center gap-x-3 overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
      <div className="relative min-w-0 flex-1">
        <label className="sr-only" htmlFor="book-search">{t("filters.search")}</label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input id="book-search" name="q" type="search" maxLength={100} defaultValue={search} placeholder={t("filters.search")} className="h-10 w-full min-w-0 rounded-lg border border-input bg-field pl-10 pr-3 text-sm outline-none" />
      </div>
      <FilterGroup name="ownership" legend={t("filters.ownership")} hideLegend value={filter.ownership ?? ""} options={[
        { value: "", label: t("filters.allOwnership"), icon: Layers },
        { value: "OWNED", label: t("form.owned"), icon: LibraryBig },
        { value: "WISHLIST", label: t("form.wishlist"), icon: Heart, iconClass: "text-warm-accent" },
      ]} />
      <div
        ref={panelRef}
        id="library-extra-filters"
        aria-hidden={!expanded}
        inert={!expanded}
        className="min-h-0 overflow-hidden lg:col-span-3 lg:row-start-2"
        style={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-5 pt-5">
            <FilterGroup name="reading" legend={t("filters.reading")} value={filter.reading ?? ""} options={[
              { value: "", label: t("filters.allReading"), icon: Layers },
              { value: "WANT_TO_READ", label: t("form.wantToRead"), icon: BookOpen, iconClass: "text-warm-accent" },
              { value: "READING", label: t("form.readingNow"), icon: BookOpen },
              { value: "READ", label: t("form.read"), icon: Check },
              { value: "ABANDONED", label: t("form.abandoned"), icon: Pause, iconClass: "text-muted-foreground" },
            ]} />
            <div>
              <FilterGroup name="stage" legend={t("filters.stage")} value={filter.stage ?? ""} options={[
                { value: "", label: t("filters.allStages"), icon: Layers },
                { value: "NIGREDO", label: greatT("stages.NIGREDO.name"), icon: Eclipse },
                { value: "ALBEDO", label: greatT("stages.ALBEDO.name"), icon: Moon },
                { value: "CITRINITAS", label: greatT("stages.CITRINITAS.name"), icon: Sun, iconClass: "text-warm-accent" },
                { value: "RUBEDO", label: greatT("stages.RUBEDO.name"), icon: Flame, iconClass: "text-destructive" },
              ]} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 lg:col-start-3 lg:row-start-1 lg:mt-0">
        <button type="submit" className="h-10 flex-1 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/80 lg:flex-none">{t("filters.apply")}</button>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="library-extra-filters"
          aria-label={t(expanded ? "filters.fewerFilters" : "filters.moreFilters")}
          title={t(expanded ? "filters.fewerFilters" : "filters.moreFilters")}
          onClick={toggle}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </form>
  );
}
