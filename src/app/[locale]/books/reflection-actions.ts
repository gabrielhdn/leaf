"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { z } from "zod";
import { parseReflectionForm } from "@/domain/reflection-input";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { requireOwner } from "@/lib/auth/owner-session";
import { markAssimilated, saveReflection } from "@/lib/reflections";

export type ReflectionFormState = { error: "invalid" | "notFinished" | null };

function formContext(formData: FormData) {
  const id = formData.get("bookId");
  const requestedLocale = formData.get("locale");
  return {
    id: typeof id === "string" && z.uuid().safeParse(id).success ? id : null,
    locale: typeof requestedLocale === "string" && hasLocale(routing.locales, requestedLocale)
      ? requestedLocale
      : routing.defaultLocale,
  };
}

function refreshJourneyPages(locale: string, id: string) {
  revalidatePath(getPathname({ href: `/books/${id}`, locale }));
  revalidatePath(getPathname({ href: "/", locale }));
  revalidatePath(getPathname({ href: "/reading", locale }));
  revalidatePath(getPathname({ href: "/great-work", locale }));
}

export async function submitReflection(
  _previous: ReflectionFormState,
  formData: FormData,
): Promise<ReflectionFormState> {
  await requireOwner();
  const { id, locale } = formContext(formData);
  if (!id) return { error: "notFinished" };
  const parsed = parseReflectionForm(formData);
  if (!parsed.success) return { error: "invalid" };

  if (!(await saveReflection(id, parsed.data))) return { error: "notFinished" };
  refreshJourneyPages(locale, id);
  redirect(`${getPathname({ href: `/books/${id}`, locale })}#reflection`);
}

export async function assimilateBook(formData: FormData): Promise<void> {
  await requireOwner();
  const { id, locale } = formContext(formData);
  if (!id) return;
  if (!(await markAssimilated(id))) return;
  refreshJourneyPages(locale, id);
  redirect(`${getPathname({ href: `/books/${id}`, locale })}#reflection`);
}
