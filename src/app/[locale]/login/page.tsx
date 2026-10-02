import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { isOwner, isOwnerAuthConfigured } from "@/lib/auth/owner-session";
import { logout } from "./actions";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Access");
  const configured = isOwnerAuthConfigured();
  const signedIn = configured && (await isOwner());

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-lg rounded-[1.5rem] border border-border bg-card p-7 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-5 font-heading text-5xl font-medium leading-none tracking-tight text-brand sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          {signedIn ? t("signedIn") : t("description")}
        </p>

        {!configured ? (
          <p className="mt-8 rounded-lg border border-border bg-muted p-4 text-sm">
            {t("unavailable")}
          </p>
        ) : signedIn ? (
          <form action={logout} className="mt-8">
            <input type="hidden" name="locale" value={locale} />
            <Button type="submit" variant="outline" size="lg">
              {t("signOut")}
            </Button>
          </form>
        ) : (
          <LoginForm locale={locale} />
        )}

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-muted-foreground transition-[color,opacity] duration-200 hover:opacity-80 hover:text-foreground"
        >
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
