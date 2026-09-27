import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { isOwner } from "@/lib/auth/owner-session";
import { BookForm } from "../book-form";

export const dynamic = "force-dynamic";

export default async function NewBookPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!(await isOwner())) redirect({ href: "/login", locale });
  const t = await getTranslations("Books");

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("form.eyebrow")}</p>
      <h1 className="mt-4 font-heading text-5xl font-medium text-brand sm:text-6xl">{t("form.newTitle")}</h1>
      <div className="mt-9 rounded-2xl border border-border bg-card p-6 sm:p-9">
        <BookForm locale={locale} />
      </div>
    </main>
  );
}
