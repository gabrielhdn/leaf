"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <nav
      aria-label={t("language")}
      className="flex items-center rounded-xl border border-border bg-card p-0.5 text-xs font-semibold tracking-wide"
    >
      {(["pt", "en"] as const).map((option) => (
        <Link
          key={option}
          href={pathname}
          locale={option}
          hrefLang={option}
          aria-current={locale === option ? "page" : undefined}
          className="rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
