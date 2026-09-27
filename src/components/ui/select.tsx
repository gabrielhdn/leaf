import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = React.ComponentProps<"select"> & {
  containerClassName?: string;
  fieldSize?: "sm" | "md" | "lg";
};

export function Select({
  children,
  className,
  containerClassName,
  fieldSize = "md",
  ...props
}: SelectProps) {
  return (
    <span className={cn("relative block min-w-0", containerClassName)}>
      <select
        {...props}
        className={cn(
          "w-full appearance-none truncate rounded-lg border border-input bg-field pl-4 pr-10 text-sm outline-none",
          fieldSize === "sm" ? "h-9" : fieldSize === "lg" ? "h-11" : "h-10",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  );
}
