"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CvContent } from "@/lib/cv-types";

type Props = {
  content: CvContent;
  onChange: (content: CvContent) => void;
};

export function SectionEditors({ content, onChange }: Props) {
  const header = content.header ?? { fullName: "", title: "" };
  const contact = content.contact ?? {};
  const skills = content.skills ?? [];
  const education = content.education ?? [];
  const military = content.military ?? [];
  const otherExperience = content.otherExperience ?? [];
  const languages = content.languages ?? [];
  const experience = content.experience ?? [];

  return (
    <div className="space-y-8">
      <EditorBlock title="Header">
        <Input
          label="Full name"
          value={header.fullName}
          onChange={(e) =>
            onChange({
              ...content,
              header: { ...header, fullName: e.target.value },
            })
          }
        />
        <Input
          label="Title"
          value={header.title}
          onChange={(e) =>
            onChange({
              ...content,
              header: { ...header, title: e.target.value },
            })
          }
        />
      </EditorBlock>

      <EditorBlock title="Contact">
        <Input
          label="Phone"
          value={contact.phone ?? ""}
          onChange={(e) =>
            onChange({
              ...content,
              contact: { ...contact, phone: e.target.value },
            })
          }
        />
        <Input
          label="Email"
          type="email"
          value={contact.email ?? ""}
          onChange={(e) =>
            onChange({
              ...content,
              contact: { ...contact, email: e.target.value },
            })
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="LinkedIn label"
            value={contact.linkedin?.label ?? ""}
            onChange={(e) =>
              onChange({
                ...content,
                contact: {
                  ...contact,
                  linkedin: {
                    label: e.target.value,
                    url: contact.linkedin?.url ?? "",
                  },
                },
              })
            }
          />
          <Input
            label="LinkedIn URL"
            value={contact.linkedin?.url ?? ""}
            onChange={(e) =>
              onChange({
                ...content,
                contact: {
                  ...contact,
                  linkedin: {
                    label: contact.linkedin?.label ?? "",
                    url: e.target.value,
                  },
                },
              })
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Website label"
            value={contact.website?.label ?? ""}
            onChange={(e) =>
              onChange({
                ...content,
                contact: {
                  ...contact,
                  website: {
                    label: e.target.value,
                    url: contact.website?.url ?? "",
                  },
                },
              })
            }
          />
          <Input
            label="Website URL"
            value={contact.website?.url ?? ""}
            onChange={(e) =>
              onChange({
                ...content,
                contact: {
                  ...contact,
                  website: {
                    label: contact.website?.label ?? "",
                    url: e.target.value,
                  },
                },
              })
            }
          />
        </div>
      </EditorBlock>

      <EditorBlock title="Summary">
        <Textarea
          label="Professional summary"
          value={content.summary ?? ""}
          onChange={(e) => onChange({ ...content, summary: e.target.value })}
        />
      </EditorBlock>

      <ListBlock
        title="Skills"
        onAdd={() =>
          onChange({
            ...content,
            skills: [...skills, { category: "", items: "" }],
          })
        }
      >
        {skills.map((skill, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-[var(--line)] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Skill group {index + 1}
              </p>
              <IconButton
                onClick={() =>
                  onChange({
                    ...content,
                    skills: skills.filter((_, i) => i !== index),
                  })
                }
              />
            </div>
            <Input
              label="Category"
              value={skill.category}
              onChange={(e) => {
                const next = [...skills];
                next[index] = { ...skill, category: e.target.value };
                onChange({ ...content, skills: next });
              }}
            />
            <Textarea
              label="Items"
              value={skill.items}
              onChange={(e) => {
                const next = [...skills];
                next[index] = { ...skill, items: e.target.value };
                onChange({ ...content, skills: next });
              }}
            />
          </div>
        ))}
      </ListBlock>

      <ListBlock
        title="Education"
        onAdd={() =>
          onChange({
            ...content,
            education: [
              ...education,
              { degree: "", institution: "", dates: "", description: "" },
            ],
          })
        }
      >
        {education.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-[var(--line)] p-3"
          >
            <RowHeader
              label={`Education ${index + 1}`}
              onRemove={() =>
                onChange({
                  ...content,
                  education: education.filter((_, i) => i !== index),
                })
              }
            />
            <Input
              label="Degree"
              value={item.degree}
              onChange={(e) => {
                const next = [...education];
                next[index] = { ...item, degree: e.target.value };
                onChange({ ...content, education: next });
              }}
            />
            <Input
              label="Institution"
              value={item.institution}
              onChange={(e) => {
                const next = [...education];
                next[index] = { ...item, institution: e.target.value };
                onChange({ ...content, education: next });
              }}
            />
            <Input
              label="Dates"
              value={item.dates}
              onChange={(e) => {
                const next = [...education];
                next[index] = { ...item, dates: e.target.value };
                onChange({ ...content, education: next });
              }}
            />
            <Textarea
              label="Description"
              value={item.description ?? ""}
              onChange={(e) => {
                const next = [...education];
                next[index] = { ...item, description: e.target.value };
                onChange({ ...content, education: next });
              }}
            />
          </div>
        ))}
      </ListBlock>

      <RoleList
        title="Military service"
        items={military}
        onChange={(items) => onChange({ ...content, military: items })}
      />

      <RoleList
        title="Other experience"
        items={otherExperience}
        onChange={(items) => onChange({ ...content, otherExperience: items })}
      />

      <ListBlock
        title="Languages"
        onAdd={() =>
          onChange({
            ...content,
            languages: [...languages, { language: "", level: "" }],
          })
        }
      >
        {languages.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-[var(--line)] p-3"
          >
            <RowHeader
              label={`Language ${index + 1}`}
              onRemove={() =>
                onChange({
                  ...content,
                  languages: languages.filter((_, i) => i !== index),
                })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Language"
                value={item.language}
                onChange={(e) => {
                  const next = [...languages];
                  next[index] = { ...item, language: e.target.value };
                  onChange({ ...content, languages: next });
                }}
              />
              <Input
                label="Level"
                value={item.level}
                onChange={(e) => {
                  const next = [...languages];
                  next[index] = { ...item, level: e.target.value };
                  onChange({ ...content, languages: next });
                }}
              />
            </div>
          </div>
        ))}
      </ListBlock>

      <ListBlock
        title="Professional experience"
        onAdd={() =>
          onChange({
            ...content,
            experience: [
              ...experience,
              {
                title: "",
                company: "",
                dates: "",
                companyDescription: "",
                bullets: [""],
              },
            ],
          })
        }
      >
        {experience.map((job, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-[var(--line)] p-3"
          >
            <RowHeader
              label={`Job ${index + 1}`}
              onRemove={() =>
                onChange({
                  ...content,
                  experience: experience.filter((_, i) => i !== index),
                })
              }
            />
            <Input
              label="Job title"
              value={job.title}
              onChange={(e) => {
                const next = [...experience];
                next[index] = { ...job, title: e.target.value };
                onChange({ ...content, experience: next });
              }}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Company"
                value={job.company}
                onChange={(e) => {
                  const next = [...experience];
                  next[index] = { ...job, company: e.target.value };
                  onChange({ ...content, experience: next });
                }}
              />
              <Input
                label="Dates"
                value={job.dates}
                onChange={(e) => {
                  const next = [...experience];
                  next[index] = { ...job, dates: e.target.value };
                  onChange({ ...content, experience: next });
                }}
              />
            </div>
            <Textarea
              label="Company description"
              value={job.companyDescription ?? ""}
              onChange={(e) => {
                const next = [...experience];
                next[index] = { ...job, companyDescription: e.target.value };
                onChange({ ...content, experience: next });
              }}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Bullets</p>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    const next = [...experience];
                    next[index] = {
                      ...job,
                      bullets: [...job.bullets, ""],
                    };
                    onChange({ ...content, experience: next });
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add bullet
                </Button>
              </div>
              {job.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="flex gap-2">
                  <Textarea
                    label={`Bullet ${bIndex + 1}`}
                    className="min-h-[64px]"
                    value={bullet}
                    onChange={(e) => {
                      const next = [...experience];
                      const bullets = [...job.bullets];
                      bullets[bIndex] = e.target.value;
                      next[index] = { ...job, bullets };
                      onChange({ ...content, experience: next });
                    }}
                  />
                  <button
                    type="button"
                    className="mt-7 rounded-md p-2 text-[var(--muted)] hover:bg-[var(--mist)] hover:text-[var(--ink)]"
                    onClick={() => {
                      const next = [...experience];
                      next[index] = {
                        ...job,
                        bullets: job.bullets.filter((_, i) => i !== bIndex),
                      };
                      onChange({ ...content, experience: next });
                    }}
                    aria-label="Remove bullet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ListBlock>
    </div>
  );
}

function RoleList({
  title,
  items,
  onChange,
}: {
  title: string;
  items: Array<{ role: string; dates: string; description?: string }>;
  onChange: (
    items: Array<{ role: string; dates: string; description?: string }>
  ) => void;
}) {
  return (
    <ListBlock
      title={title}
      onAdd={() =>
        onChange([...items, { role: "", dates: "", description: "" }])
      }
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-lg border border-[var(--line)] p-3"
        >
          <RowHeader
            label={`${title} ${index + 1}`}
            onRemove={() => onChange(items.filter((_, i) => i !== index))}
          />
          <Input
            label="Role"
            value={item.role}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, role: e.target.value };
              onChange(next);
            }}
          />
          <Input
            label="Dates"
            value={item.dates}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, dates: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            label="Description"
            value={item.description ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[index] = { ...item, description: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
    </ListBlock>
  );
}

function EditorBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ListBlock({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
          {title}
        </h3>
        <Button variant="secondary" className="h-9 px-3 text-xs" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function RowHeader({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <IconButton onClick={onRemove} />
    </div>
  );
}

function IconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--mist)] hover:text-[var(--ink)]"
      aria-label="Remove"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
