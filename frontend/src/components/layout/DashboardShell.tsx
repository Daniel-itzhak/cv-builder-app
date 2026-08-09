"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import {
  clearSession,
  getUser,
  getUserInitials,
  type AuthUser,
} from "@/lib/auth";
import { BrandLink } from "@/components/layout/BrandLink";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cvs", label: "My CVs", icon: FileText },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--paper)] p-6 md:flex md:flex-col">
        <BrandLink
          forceDashboard
          className="text-[var(--ink)]"
          iconClassName="bg-[var(--ink)] text-[var(--paper)]"
        />

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--mist)] text-[var(--ink)]"
                    : "text-[var(--muted)] hover:bg-[var(--mist)] hover:text-[var(--ink)]"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--paper)]/90 px-4 py-3 backdrop-blur md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              Workspace
            </p>
            <p className="font-[family-name:var(--font-display)] text-lg tracking-tight md:hidden">
              Folio
            </p>
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function refreshUser() {
      setUserState(getUser());
    }

    refreshUser();
    window.addEventListener("folio:user-updated", refreshUser);
    return () => window.removeEventListener("folio:user-updated", refreshUser);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleLogout() {
    clearSession();
    setOpen(false);
    router.push("/login");
  }

  const initials = getUserInitials(user);
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : "Account";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--mist)] text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        {user ? initials : <User className="h-4 w-4" aria-hidden />}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--paper)] py-1 shadow-lg"
        >
          <div className="border-b border-[var(--line)] px-3 py-2.5">
            <p className="truncate text-sm font-medium text-[var(--ink)]">
              {displayName}
            </p>
            {user?.profession ? (
              <p className="truncate text-xs text-[var(--muted)]">
                {user.profession}
              </p>
            ) : null}
            {user?.email ? (
              <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
            ) : null}
          </div>

          <Link
            href="/dashboard/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--mist)]"
          >
            <Settings className="h-4 w-4 text-[var(--muted)]" aria-hidden />
            Settings
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--mist)]"
          >
            <LogOut className="h-4 w-4 text-[var(--muted)]" aria-hidden />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}
