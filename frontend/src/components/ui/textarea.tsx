import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ className, label, id, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-[var(--ink)]">{label}</span>
      <textarea
        id={inputId}
        className={cn(
          "min-h-[88px] resize-y rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
          className
        )}
        {...props}
      />
    </label>
  );
}
