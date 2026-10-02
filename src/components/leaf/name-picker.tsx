"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type NameOption = { id: string; name: string };

const nameKey = (name: string) => name.trim().toLocaleLowerCase("pt");

export type NamePickerProps = {
  value: string[];
  onChange: (value: string[]) => void;
  name: string;
  namespace: "Categories" | "Authors";
  loadOptions: (query: string) => Promise<NameOption[]>;
  maxLength: number;
  maxItems?: number;
  allowCreate?: boolean;
  revision?: number;
  required?: boolean;
};

export function NamePicker({ value, onChange, name, namespace, loadOptions, maxLength, maxItems = Infinity, allowCreate = true, revision = 0, required = false }: NamePickerProps) {
  const t = useTranslations(namespace);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<NameOption[]>([]);
  const [highlighted, setHighlighted] = useState<NameOption>();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      loadOptions(query).then((items) => {
        if (active) { setOptions(items); setError(false); }
      }).catch(() => { if (active) setError(true); });
    }, 200);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [query, revision, loadOptions]);

  function add(entryName: string) {
    if (!entryName.trim() || entryName.length > maxLength || value.length >= maxItems) return;
    if (!value.some((entry) => nameKey(entry) === nameKey(entryName))) onChange([...value, entryName]);
    setQuery("");
  }

  return (
    <div className="space-y-3">
      {value.map((entryName) => <input key={nameKey(entryName)} type="hidden" name={name} value={entryName} />)}
      {allowCreate && query.trim() && value.length < maxItems && !value.some((entry) => nameKey(entry) === nameKey(query)) && <input type="hidden" name={name} value={query} />}
      <Autocomplete.Root
        items={options.filter((option) => !value.some((entry) => nameKey(entry) === nameKey(option.name)))}
        value={query}
        onValueChange={setQuery}
        onItemHighlighted={setHighlighted}
        itemToStringValue={(item: NameOption) => item.name}
        filter={(option: NameOption, query: string) => nameKey(option.name).includes(nameKey(query))}
        required={required && value.length === 0}
        submitOnItemClick={false}
        openOnInputClick
      >
        <div className="flex gap-2">
          <Autocomplete.Input
            aria-label={t("title")}
            maxLength={maxLength}
            required={required && value.length === 0}
            placeholder={t(allowCreate ? "placeholder" : "filterPlaceholder")}
            className="h-11 w-full min-w-0 rounded-lg border border-input bg-field px-3 text-sm outline-none"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !highlighted && query.trim()) {
                event.preventDefault();
                if (allowCreate) add(query);
              }
            }}
          />
          {allowCreate && <button type="button" onClick={() => add(query)} disabled={!query.trim() || value.length >= maxItems} aria-label={t("add")} className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-field text-brand hover:bg-muted/40 disabled:opacity-40"><Plus className="size-4" aria-hidden="true" /></button>}
        </div>
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={6} className="z-70">
            <Autocomplete.Popup className="w-[var(--anchor-width)] rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg">
              <Autocomplete.List className="max-h-64 overflow-y-auto">
                {(option: NameOption) => <Autocomplete.Item key={option.id} value={option} onClick={() => add(option.name)} className="cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors data-highlighted:bg-navigation-active">{option.name}</Autocomplete.Item>}
              </Autocomplete.List>
              <Autocomplete.Empty className="px-3 py-2 text-sm text-muted-foreground">{t(allowCreate ? "createOnSave" : "noMatches")}</Autocomplete.Empty>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      {value.length > 0 && <div className="flex flex-wrap gap-2">
        {value.map((entryName) => <span key={nameKey(entryName)} className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
          {entryName}
          <button type="button" aria-label={t("remove", { name: entryName })} onClick={() => onChange(value.filter((entry) => entry !== entryName))} className="rounded transition-opacity hover:opacity-60"><X aria-hidden="true" className="size-3.5" /></button>
        </span>)}
      </div>}
      {allowCreate && <p className="text-xs leading-5 text-muted-foreground">{t("help")}</p>}
      {error && <p role="alert" className="text-xs text-destructive">{t("loadError")}</p>}
    </div>
  );
}
