"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, PlusCircle, Trash2 } from "lucide-react";
import { TemplateThumbnail } from "@/components/cv/TemplateThumbnail";
import { Button } from "@/components/ui/button";
import { deleteCv, listCvs } from "@/lib/cv-api";
import { getToken } from "@/lib/auth";
import type { CvListItem } from "@/lib/cv-types";

export default function CvsPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    void (async () => {
      try {
        const data = await listCvs();
        setCvs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load CVs");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this CV?")) return;
    try {
      await deleteCv(id);
      setCvs((prev) => prev.filter((cv) => cv.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            My CVs
          </h2>
          <p className="mt-1 text-[var(--muted)]">
            Create a CV from a template, then edit content live.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/cvs/new")}>
          <PlusCircle className="h-4 w-4" />
          New CV
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && cvs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper)] px-6 py-16 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-[var(--muted)]" />
          <p className="text-sm text-[var(--muted)]">
            No CVs yet. Pick a template to get started.
          </p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/cvs/new")}>
            <PlusCircle className="h-4 w-4" />
            Create your first CV
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]"
          >
            {cv.template ? (
              <Link href={`/dashboard/cvs/${cv.id}/edit`} className="block">
                <TemplateThumbnail
                  name={cv.template.name}
                  thumbnail={cv.template.thumbnailSchema}
                  showMeta={false}
                  framed={false}
                />
              </Link>
            ) : (
              <Link
                href={`/dashboard/cvs/${cv.id}/edit`}
                className="flex aspect-[210/297] items-center justify-center bg-[var(--mist)] text-sm text-[var(--muted)]"
              >
                Open editor
              </Link>
            )}
            <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] px-4 py-3">
              <div className="min-w-0">
                <Link
                  href={`/dashboard/cvs/${cv.id}/edit`}
                  className="block truncate font-medium hover:underline"
                >
                  {cv.title}
                </Link>
                <p className="text-xs text-[var(--muted)]">
                  Updated {new Date(cv.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(cv.id)}
                className="rounded-md p-2 text-[var(--muted)] hover:bg-[var(--mist)] hover:text-[var(--ink)]"
                aria-label="Delete CV"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
