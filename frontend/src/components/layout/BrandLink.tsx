"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { hasValidSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  iconClassName?: string;
  /** When true, always link to dashboard (used inside authenticated shell). */
  forceDashboard?: boolean;
};

export function BrandLink({
  className,
  iconClassName,
  forceDashboard = false,
}: Props) {
  const [href, setHref] = useState(forceDashboard ? "/dashboard" : "/");

  useEffect(() => {
    if (forceDashboard) {
      setHref("/dashboard");
      return;
    }
    setHref(hasValidSession() ? "/dashboard" : "/");
  }, [forceDashboard]);

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md",
          iconClassName
        )}
      >
        <FileText className="h-4 w-4" aria-hidden />
      </span>
      <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
        Folio
      </span>
    </Link>
  );
}
