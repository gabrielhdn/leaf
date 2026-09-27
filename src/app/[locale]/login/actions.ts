"use server";

import { AuthError } from "next-auth";
import { hasLocale } from "next-intl";
import { signIn, signOut } from "@/auth";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { isOwnerAuthConfigured } from "@/lib/auth/owner-session";

export type LoginState = { error: "invalid" | "unavailable" | null };

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isOwnerAuthConfigured()) return { error: "unavailable" };

  const password = formData.get("password");
  if (typeof password !== "string" || !password) return { error: "invalid" };

  const requestedLocale = formData.get("locale");
  const locale =
    typeof requestedLocale === "string" &&
    hasLocale(routing.locales, requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  try {
    await signIn("credentials", {
      password,
      redirectTo: getPathname({ href: "/", locale }),
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "invalid" };
    throw error;
  }

  return { error: null };
}

export async function logout(formData: FormData): Promise<void> {
  const requestedLocale = formData.get("locale");
  const locale =
    typeof requestedLocale === "string" &&
    hasLocale(routing.locales, requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;
  await signOut({ redirectTo: getPathname({ href: "/", locale }) });
}
