import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeSwitcher } from "./theme-switcher";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className="border-b border-border/70">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Leaf">
          <span className="relative block size-11 shrink-0">
            <Image
              src="/brand/logo-light.png"
              alt=""
              width={44}
              height={42}
              priority
              className="size-full object-contain dark:hidden"
            />
            <Image
              src="/brand/logo-dark.png"
              alt=""
              width={44}
              height={42}
              priority
              className="hidden size-full object-contain dark:block"
            />
          </span>
          <span className="font-heading text-[2rem] font-medium leading-none tracking-tight text-brand">
            Leaf
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav aria-label={t("library")} className="hidden sm:block">
            <Link
              href="/"
              aria-current="page"
              className="text-sm font-medium text-foreground underline decoration-warm-accent decoration-2 underline-offset-[0.65rem]"
            >
              {t("library")}
            </Link>
          </nav>
          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
