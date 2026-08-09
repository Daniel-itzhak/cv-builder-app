import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-soft)] shadow-sm",
  secondary:
    "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--mist)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--mist)]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
