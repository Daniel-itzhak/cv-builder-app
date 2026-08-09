"use client";

import Link from "next/link";
import { BrandLink } from "@/components/layout/BrandLink";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
  }, []);

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
      <BrandLink
        className="text-[var(--paper)]"
        iconClassName="bg-white/15 text-[var(--paper)] ring-1 ring-white/20"
      />
      <nav className="flex items-center gap-2">
        {loggedIn ? (
          <Link href="/dashboard">
            <Button className="bg-[var(--paper)] text-[var(--ink)] hover:bg-white">
              Go to dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-[var(--paper)] hover:bg-white/10"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[var(--paper)] text-[var(--ink)] hover:bg-white">
                Get started
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
