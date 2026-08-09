import Link from "next/link";
import { FilePlus2, Files, Upload } from "lucide-react";

const stats = [
  {
    label: "Draft CVs",
    value: "—",
    hint: "Open My CVs to create and edit",
    icon: Files,
  },
  {
    label: "Published",
    value: "0",
    hint: "Share links will appear here",
    icon: Upload,
  },
  {
    label: "Templates",
    value: "1",
    hint: "Sidebar Classic — more coming soon",
    icon: FilePlus2,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Overview
        </h2>
        <p className="mt-2 max-w-xl text-[var(--muted)]">
          Pick a template, edit sections, colors, and icons — and see every change
          live in the preview.
        </p>
        <Link
          href="/dashboard/cvs/new"
          className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Create a new CV →
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5"
          >
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[var(--mist)] text-[var(--ink)]">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
              {value}
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
