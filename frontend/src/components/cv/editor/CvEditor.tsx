"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { SidebarClassicPreview } from "@/components/cv/SidebarClassicPreview";
import { IconEditor } from "@/components/cv/editor/IconEditor";
import { SectionEditors } from "@/components/cv/editor/SectionEditors";
import { ThemeEditor } from "@/components/cv/editor/ThemeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCv } from "@/lib/cv-api";
import type { CvContent, CvDetail } from "@/lib/cv-types";
import { cn } from "@/lib/utils";

type Tab = "content" | "colors" | "icons";

type Props = {
  initialCv: CvDetail;
};

type Draft = {
  title: string;
  content: CvContent;
};

function normalizeDraft(draft: Draft): Draft {
  return {
    title: draft.title.trim() || "Untitled CV",
    content: draft.content,
  };
}

export function CvEditor({ initialCv }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialCv.title);
  const [content, setContent] = useState<CvContent>(initialCv.content ?? {});
  const [tab, setTab] = useState<Tab>("content");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const latestRef = useRef<Draft>({ title, content });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstSave = useRef(true);
  const dirtyRef = useRef(false);
  const mountedRef = useRef(true);
  /** Serializes saves so an older PATCH never overwrites a newer one. */
  const saveChainRef = useRef(Promise.resolve());

  function setDraftTitle(next: string) {
    setTitle(next);
    latestRef.current = { ...latestRef.current, title: next };
  }

  function setDraftContent(next: CvContent) {
    setContent(next);
    latestRef.current = { ...latestRef.current, content: next };
  }

  function persist(): Promise<void> {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    dirtyRef.current = true;

    const run = async () => {
      if (!dirtyRef.current) return;

      const payload = normalizeDraft(latestRef.current);
      dirtyRef.current = false;

      if (mountedRef.current) {
        setSaveState("saving");
        setError(null);
      }

      try {
        await updateCv(initialCv.id, payload);

        if (mountedRef.current) {
          if (latestRef.current.title.trim() === "") {
            setTitle(payload.title);
          }
          // Only show Saved if nothing newer was queued while we were writing
          if (!dirtyRef.current) {
            setSaveState("saved");
          }
        }
      } catch (err) {
        dirtyRef.current = true;
        if (mountedRef.current) {
          setSaveState("error");
          setError(err instanceof Error ? err.message : "Failed to save");
        }
      }
    };

    const next = saveChainRef.current.then(run, run);
    saveChainRef.current = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }

  function scheduleSave() {
    dirtyRef.current = true;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (mountedRef.current) setSaveState("idle");
    saveTimer.current = setTimeout(() => {
      void persist();
    }, 700);
  }

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    scheduleSave();
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce on title/content only
  }, [title, content]);

  useEffect(() => {
    mountedRef.current = true;

    const onLeave = () => {
      if (!dirtyRef.current && !saveTimer.current) return;
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      void persist();
    };

    window.addEventListener("beforeunload", onLeave);
    window.addEventListener("pagehide", onLeave);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("beforeunload", onLeave);
      window.removeEventListener("pagehide", onLeave);

      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }

      if (dirtyRef.current) {
        const payload = normalizeDraft(latestRef.current);
        void updateCv(initialCv.id, payload);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCv.id]);

  async function handleBack() {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (dirtyRef.current) {
      try {
        await persist();
      } catch {
        // Still navigate; error state already set if mount still active
      }
    }
    router.push("/dashboard/cvs");
  }

  return (
    <div className="-mx-4 -my-8 flex min-h-[calc(100vh-4.5rem)] flex-col md:-mx-8">
      <header className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => void handleBack()}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="min-w-[200px] flex-1">
          <Input
            label="CV title"
            className="py-2"
            value={title}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          {saveState === "saving" ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : null}
          {saveState === "saved" ? (
            <>
              <Check className="h-4 w-4 text-[var(--accent)]" />
              Saved
            </>
          ) : null}
          {saveState === "error" ? (
            <span className="text-red-600">{error ?? "Save failed"}</span>
          ) : null}
          <Button
            variant="secondary"
            className="h-9"
            onClick={() => void persist()}
          >
            Save now
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,420px)_1fr]">
        <aside className="flex min-h-0 flex-col border-b border-[var(--line)] bg-[var(--paper)] lg:border-b-0 lg:border-r">
          <div className="flex gap-1 border-b border-[var(--line)] p-2">
            {(
              [
                ["content", "Content"],
                ["colors", "Colors"],
                ["icons", "Icons"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex-1 rounded-md px-3 py-2 text-sm transition",
                  tab === id
                    ? "bg-[var(--mist)] font-medium text-[var(--ink)]"
                    : "text-[var(--muted)] hover:bg-[var(--mist)]/60"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
            {tab === "content" ? (
              <SectionEditors content={content} onChange={setDraftContent} />
            ) : null}
            {tab === "colors" ? (
              <ThemeEditor content={content} onChange={setDraftContent} />
            ) : null}
            {tab === "icons" ? (
              <IconEditor content={content} onChange={setDraftContent} />
            ) : null}
          </div>
        </aside>

        <section className="min-h-0 overflow-auto bg-[var(--canvas)] p-4 md:p-8">
          <div className="mx-auto w-fit">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              Live preview · {initialCv.template?.name ?? "Template"}
            </p>
            <div className="origin-top scale-[0.55] sm:scale-[0.65] md:scale-[0.72] xl:scale-[0.82]">
              <SidebarClassicPreview content={content} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
