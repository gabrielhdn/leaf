"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function ReadingEntryDeleteButton() {
  const t = useTranslations("ReadingEntries");

  return (
    <Button type="submit" variant="destructive" size="sm" onClick={(event) => {
      if (!window.confirm(t("deleteConfirm"))) event.preventDefault();
    }}>
      {t("delete")}
    </Button>
  );
}
