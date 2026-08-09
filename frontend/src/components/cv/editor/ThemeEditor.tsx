"use client";

import { COLOR_LABELS, type CvContent, type CvThemeColors } from "@/lib/cv-types";
import { mergeThemeColors } from "@/lib/default-content";

type Props = {
  content: CvContent;
  onChange: (content: CvContent) => void;
};

export function ThemeEditor({ content, onChange }: Props) {
  const colors = mergeThemeColors(content);

  function setColor(key: keyof CvThemeColors, value: string) {
    onChange({
      ...content,
      theme: {
        ...content.theme,
        colors: {
          ...colors,
          [key]: value,
        },
      },
    });
  }

  return (
    <section className="space-y-3">
      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
        Colors
      </h3>
      <p className="text-sm text-[var(--muted)]">
        Changes apply instantly in the live preview.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(COLOR_LABELS) as Array<keyof CvThemeColors>).map((key) => (
          <label
            key={key}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm"
          >
            <span className="font-medium text-[var(--ink)]">
              {COLOR_LABELS[key]}
            </span>
            <input
              type="color"
              value={normalizeHex(colors[key])}
              onChange={(e) => setColor(key, e.target.value)}
              className="h-9 w-12 cursor-pointer rounded border border-[var(--line)] bg-transparent p-0.5"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

function normalizeHex(value: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  return "#000000";
}
