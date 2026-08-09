import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="flex items-center gap-2 text-[var(--paper)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-[var(--paper)] ring-1 ring-white/20">
          <FileText className="h-4 w-4" aria-hidden />
        </span>
        <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Folio
        </span>
      </Link>
      <nav className="flex items-center gap-2">
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
      </nav>
    </header>
  );
}
