import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-[var(--ink)]">{label}</span>
      <input
        id={inputId}
        className={cn(
          "rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
          className
        )}
        {...props}
      />
    </label>
  );
}
