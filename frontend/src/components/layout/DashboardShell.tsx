import Link from "next/link";
import { FileText, LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/cvs", label: "My CVs", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--paper)] p-6 md:block">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--ink)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--ink)] text-[var(--paper)]">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            Folio
          </span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--mist)] hover:text-[var(--ink)]"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
