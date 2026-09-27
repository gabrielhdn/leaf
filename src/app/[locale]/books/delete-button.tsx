"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function DeleteButton() {
  const t = useTranslations("Books.detail");

  return (
    <Button type="submit" variant="destructive" onClick={(event) => {
      if (!window.confirm(t("deleteConfirm"))) event.preventDefault();
    }}>
      {t("delete")}
    </Button>
  );
}
