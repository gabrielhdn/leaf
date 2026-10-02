"use client";

import { findCategories } from "@/app/[locale]/books/category-actions";
import { NamePicker, type NamePickerProps } from "./name-picker";

type CategoryPickerProps = Pick<NamePickerProps, "value" | "onChange" | "allowCreate" | "revision"> & { name?: string };

export function CategoryPicker({ name = "categories", ...props }: CategoryPickerProps) {
  return <NamePicker {...props} name={name} namespace="Categories" loadOptions={findCategories} maxLength={100} maxItems={20} />;
}
