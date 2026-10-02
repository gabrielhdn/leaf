"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher({ onNavigate }: { onNavigate?: () => void } = {}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <nav
      aria-label={t("language")}
      className="flex items-center rounded-xl border border-border bg-card p-0.5 text-xs font-semibold tracking-wide"
    >
      {(["pt", "en"] as const).map((option) => (
        <a
          key={option}
          href={getPathname({ href: pathname, locale: option })}
          hrefLang={option}
          aria-current={locale === option ? "page" : undefined}
          onClick={onNavigate}
          className="rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
        >
          {option.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
