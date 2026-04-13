import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}
