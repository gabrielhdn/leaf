"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("Access");
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-2">
        <label htmlFor="owner-password" className="text-sm font-medium">
          {t("password")}
        </label>
        <Input
          id="owner-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={16}
          maxLength={1024}
          aria-invalid={state.error === "invalid"}
          aria-describedby={state.error ? "login-error" : undefined}
          className="h-11 bg-background px-3"
        />
      </div>

      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-destructive">
          {t(state.error)}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
