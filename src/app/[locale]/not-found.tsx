import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Feedback");

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
      <div className="max-w-xl rounded-2xl border border-border bg-card p-7 sm:p-9">
        <h1 className="font-heading text-5xl text-brand">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("notFoundDescription")}</p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand transition-opacity duration-200 hover:opacity-80">{t("back")}</Link>
      </div>
    </main>
  );
}
