"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Feedback");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
      <div className="max-w-xl rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h1 className="font-heading text-5xl text-brand">{t("errorTitle")}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("errorDescription")}</p>
        <Button type="button" onClick={reset} className="mt-6">{t("retry")}</Button>
      </div>
    </main>
  );
}
