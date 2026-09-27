import { BookOpenText } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
      <section className="grid items-center gap-9 lg:grid-cols-[minmax(0,1.07fr)_minmax(0,0.93fr)] lg:gap-14">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px w-9 bg-warm-accent" aria-hidden="true" />
            {t("eyebrow")}
          </p>
          <h1 className="max-w-[12ch] font-heading text-[clamp(4.1rem,8vw,7.5rem)] font-medium leading-[0.83] tracking-[-0.055em] text-brand">
            {t("title")}
          </h1>
          <p className="mt-8 max-w-[38rem] text-base leading-8 text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <p className="mt-9 font-heading text-2xl font-light italic tracking-[0.12em] text-brand">
            {t("motto")}
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-[34rem] items-center justify-center overflow-hidden rounded-[2rem] border border-border/70 bg-card px-8 py-5 shadow-[0_18px_50px_-36px_var(--foreground)] sm:px-12 lg:py-8">
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full border border-warm-accent/30"
          />
          <Image
            src="/brand/illustration.png"
            alt={t("illustrationAlt")}
            width={1254}
            height={1254}
            priority
            className="relative z-10 h-auto w-full max-w-[25rem] object-contain drop-shadow-lg"
          />
        </div>
      </section>

      <section
        aria-labelledby="shelf-title"
        className="mt-20 rounded-[1.5rem] border border-border bg-card px-6 py-8 sm:mt-24 sm:px-10 sm:py-10"
      >
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <BookOpenText className="size-4 text-brand" aria-hidden="true" />
          {t("shelfLabel")}
        </div>
        <div className="mt-7 border-t border-border pt-9">
          <h2
            id="shelf-title"
            className="font-heading text-4xl font-medium leading-none tracking-tight text-brand sm:text-5xl"
          >
            {t("shelfTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("shelfDescription")}
          </p>
        </div>
      </section>
    </main>
  );
}
