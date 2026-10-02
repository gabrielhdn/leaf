"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function SiteNav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const pages = [
    { href: "/", label: t("library") },
    { href: "/reading", label: t("reading") },
    { href: "/wishlist", label: t("wishlist") },
    { href: "/quotes", label: t("quotes") },
    { href: "/great-work", label: t("greatWork") },
  ] as const;

  return (
    <nav aria-label={t("navigation")} className="mx-auto hidden max-w-7xl items-center gap-2 border-t border-border/70 px-5 py-2 text-sm font-medium whitespace-nowrap sm:px-8 lg:flex lg:px-12">
      {pages.map(({ href, label }) => {
        const active = pathname === href || (href === "/" && pathname.startsWith("/books/"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="rounded-lg border border-transparent px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground aria-[current=page]:border-border aria-[current=page]:bg-navigation-active aria-[current=page]:text-foreground"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
