"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CvEditor } from "@/components/cv/editor/CvEditor";
import { getCv } from "@/lib/cv-api";
import { getToken } from "@/lib/auth";
import type { CvDetail } from "@/lib/cv-types";

export default function EditCvPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [cv, setCv] = useState<CvDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    const id = params.id;
    if (!id) return;

    void (async () => {
      try {
        const data = await getCv(id);
        setCv(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load CV");
      }
    })();
  }, [params.id, router]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          className="mt-4 text-sm text-[var(--accent)] underline"
          onClick={() => router.push("/dashboard/cvs")}
        >
          Back to My CVs
        </button>
      </div>
    );
  }

  if (!cv) {
    return <p className="text-sm text-[var(--muted)]">Loading editor…</p>;
  }

  return <CvEditor initialCv={cv} />;
}
