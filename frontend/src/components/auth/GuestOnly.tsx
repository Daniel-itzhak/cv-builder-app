"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, hasValidSession } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

/** Sends already-authenticated users away from login/register. */
export function GuestOnly({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasValidSession()) {
      router.replace("/dashboard");
      return;
    }
    clearSession();
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--canvas)] text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
