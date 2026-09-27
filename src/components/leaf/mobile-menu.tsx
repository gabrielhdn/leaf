"use client";

import { Menu, Plus, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getPathname, Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export function MobileMenu({ canAddBook }: { canAddBook: boolean }) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const pages = [
    { href: "/", label: t("library") },
    { href: "/reading", label: t("reading") },
    { href: "/wishlist", label: t("wishlist") },
    { href: "/quotes", label: t("quotes") },
    { href: "/great-work", label: t("greatWork") },
  ] as const;

  return (
    <div ref={rootRef} className="lg:hidden">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-controls="mobile-navigation"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="text-brand"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      <div
        id="mobile-navigation"
        data-open={open}
        aria-hidden={!open}
        className="mobile-menu-panel absolute inset-x-0 top-full z-20 max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-card shadow-lg"
      >
        <div className="mx-auto max-w-7xl space-y-5 px-5 py-5 sm:px-8">
          <form
            action={getPathname({ href: "/", locale })}
            method="get"
            role="search"
            onSubmit={() => setOpen(false)}
            className="header-search flex items-center overflow-hidden rounded-lg border border-input"
          >
            <label htmlFor="mobile-search" className="sr-only">{t("search")}</label>
            <input id="mobile-search" name="q" type="search" maxLength={100} placeholder={t("search")} className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
            <button type="submit" aria-label={t("search")} className="flex size-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"><Search className="size-4" aria-hidden="true" /></button>
          </form>

          <nav aria-label={t("navigation")} className="grid gap-1">
            {pages.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:text-brand"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <div className="flex flex-wrap items-center gap-4">
              {canAddBook && <Link href="/books/new" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"><Plus className="size-4" aria-hidden="true" />{t("addBook")}</Link>}
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">{t("access")}</Link>
            </div>
            <div className="flex items-center gap-3">
              <LocaleSwitcher onNavigate={() => setOpen(false)} />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
