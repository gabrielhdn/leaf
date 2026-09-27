"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("Feedback");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12" role="status">
      <div className="h-1 w-16 animate-pulse rounded-full bg-warm-accent" aria-hidden="true" />
      <p className="mt-5 text-sm text-muted-foreground">{t("loading")}</p>
    </main>
  );
}
