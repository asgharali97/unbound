import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({
  className,
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>): React.JSX.Element {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-background px-3.5 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
