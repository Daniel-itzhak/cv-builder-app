"use client";

import type { ThumbnailSchema } from "@/lib/cv-types";

type Props = {
  name: string;
  thumbnail: ThumbnailSchema;
  selected?: boolean;
  onSelect?: () => void;
  showMeta?: boolean;
  framed?: boolean;
};

export function TemplateThumbnail({
  name,
  thumbnail,
  selected,
  onSelect,
  showMeta = true,
  framed = true,
}: Props) {
  const colors = thumbnail.colors ?? {};
  const sidebarRatio = thumbnail.sidebarRatio ?? 0.3;

  const frame = (
    <>
      <div
        className="flex aspect-[210/297] w-full overflow-hidden"
        style={{ background: colors.main ?? "#ffffff" }}
      >
        <div
          className="flex flex-col gap-2 p-3"
          style={{
            width: `${sidebarRatio * 100}%`,
            background: colors.sidebar ?? "#f4f6f8",
            borderRight: `1px solid ${colors.border ?? "#e2e8f0"}`,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <div
                className="h-1.5 w-10 rounded-sm"
                style={{ background: colors.heading ?? "#2c3e50" }}
              />
              <div className="h-1 w-full rounded-sm bg-black/10" />
              <div className="h-1 w-[80%] rounded-sm bg-black/10" />
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div
            className="h-3 w-24 rounded-sm"
            style={{ background: colors.heading ?? "#2c3e50" }}
          />
          <div
            className="h-2 w-16 rounded-sm"
            style={{ background: colors.accent ?? "#16a085" }}
          />
          <div className="mt-2 space-y-1">
            <div className="h-1.5 w-full rounded-sm bg-black/10" />
            <div className="h-1.5 w-[83%] rounded-sm bg-black/10" />
            <div className="h-1.5 w-[80%] rounded-sm bg-black/10" />
          </div>
          <div className="mt-3 space-y-2">
            <div
              className="h-1.5 w-20 rounded-sm"
              style={{ background: colors.heading ?? "#2c3e50" }}
            />
            <div className="h-8 rounded-sm bg-black/5" />
            <div className="h-8 rounded-sm bg-black/5" />
          </div>
        </div>
      </div>
      {showMeta ? (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] px-4 py-3">
          <p className="font-medium text-[var(--ink)]">{name}</p>
          <p className="text-xs text-[var(--muted)]">Two-column · A4</p>
        </div>
      ) : null}
    </>
  );

  const className = `w-full overflow-hidden text-left transition ${
    framed ? "rounded-xl border" : ""
  } ${
    selected
      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
      : framed
        ? "border-[var(--line)]"
        : ""
  } ${onSelect ? "hover:border-[var(--accent)]/60" : ""}`;

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {frame}
      </button>
    );
  }

  return <div className={className}>{frame}</div>;
}
