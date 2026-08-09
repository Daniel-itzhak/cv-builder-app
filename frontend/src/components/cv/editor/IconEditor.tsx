"use client";

import { CONTACT_ICON_OPTIONS } from "@/lib/contact-icons";
import type { CvContactIcons, CvContent } from "@/lib/cv-types";
import { mergeIcons } from "@/lib/default-content";

type Props = {
  content: CvContent;
  onChange: (content: CvContent) => void;
};

const FIELDS: Array<{ key: keyof CvContactIcons; label: string }> = [
  { key: "phone", label: "Phone icon" },
  { key: "email", label: "Email icon" },
  { key: "linkedin", label: "LinkedIn icon" },
  { key: "website", label: "Website icon" },
];

export function IconEditor({ content, onChange }: Props) {
  const icons = mergeIcons(content);

  function setIcon(key: keyof CvContactIcons, value: string) {
    onChange({
      ...content,
      icons: {
        ...icons,
        [key]: value,
      },
    });
  }

  return (
    <section className="space-y-3">
      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
        Contact icons
      </h3>
      <p className="text-sm text-[var(--muted)]">
        Pick an icon for each contact row. Preview updates immediately.
      </p>
      <div className="space-y-4">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
            <div className="flex flex-wrap gap-2">
              {CONTACT_ICON_OPTIONS.map(({ id, label: iconLabel, Icon }) => {
                const selected = icons[key] === id;
                return (
                  <button
                    key={id}
                    type="button"
                    title={iconLabel}
                    onClick={() => setIcon(key, id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--ink)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
