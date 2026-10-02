import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname, Link } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { SiteNav } from "./site-nav";
import { ThemeSwitcher } from "./theme-switcher";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");
  const locale = await getLocale();
  const owner = await isOwner();
  const canAddBook = owner && Boolean(process.env.DATABASE_URL);

  return (
    <header className="relative z-30 border-b border-border/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Leaf">
          <span className="relative block size-14 shrink-0">
            <Image
              src="/brand/logo-alt.png"
              alt=""
              width={1354}
              height={1162}
              priority
              className="size-full object-contain"
            />
          </span>
          <span className="font-heading text-[2rem] font-medium leading-none tracking-tight text-brand">
            Leaf
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <form action={getPathname({ href: "/", locale })} method="get" role="search" className="header-search flex items-center overflow-hidden rounded-lg border border-input">
            <label htmlFor="global-search" className="sr-only">{t("search")}</label>
            <input id="global-search" name="q" type="search" maxLength={100} placeholder={t("search")} className="h-9 w-36 bg-transparent px-3 text-sm outline-none lg:w-48" />
            <button type="submit" aria-label={t("search")} className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground"><Search className="size-4" aria-hidden="true" /></button>
          </form>
          {canAddBook && <Link href="/books/new" className="inline-flex items-center gap-1 text-sm font-medium text-brand transition-opacity duration-200 hover:opacity-80"><Plus className="size-4" aria-hidden="true" />{t("addBook")}</Link>}
          <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{t("access")}</Link>
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
        <MobileMenu canAddBook={canAddBook} />
      </div>
      <SiteNav />
    </header>
  );
}
