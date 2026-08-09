"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateThumbnail } from "@/components/cv/TemplateThumbnail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCv, listFormats } from "@/lib/cv-api";
import type { CvFormatSummary } from "@/lib/cv-types";

export default function NewCvPage() {
  const router = useRouter();
  const [formats, setFormats] = useState<CvFormatSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled CV");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await listFormats();
        setFormats(data);
        if (data[0]) setSelectedId(data[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load templates");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleCreate() {
    if (!selectedId) return;
    setCreating(true);
    setError(null);
    try {
      const cv = await createCv({
        title: title.trim() || "Untitled CV",
        templateId: selectedId,
      });
      router.push(`/dashboard/cvs/${cv.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create CV");
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Choose a template
        </h2>
        <p className="mt-1 text-[var(--muted)]">
          Start from a layout, then edit text, colors, and icons with a live preview.
        </p>
      </div>

      <Input
        label="CV title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading templates…</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {formats.map((format) => (
          <TemplateThumbnail
            key={format.id}
            name={format.name}
            thumbnail={format.thumbnailSchema}
            selected={selectedId === format.id}
            onSelect={() => setSelectedId(format.id)}
          />
        ))}
      </div>

      {!loading && formats.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">
          No templates available. Run the database seed to add Sidebar Classic.
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => router.push("/dashboard/cvs")}>
          Cancel
        </Button>
        <Button
          disabled={!selectedId || creating}
          onClick={() => void handleCreate()}
        >
          {creating ? "Creating…" : "Continue to editor"}
        </Button>
      </div>
    </div>
  );
}
