import type { CvContent, ExperienceBullet, ExperienceItem } from "../types/cv";

function normalizeExperienceBullet(
  bullet: string | ExperienceBullet | null | undefined
): ExperienceBullet {
  if (bullet && typeof bullet === "object") {
    return {
      title: bullet.title ?? "",
      text: bullet.text ?? "",
    };
  }

  const raw = typeof bullet === "string" ? bullet.trim() : "";
  if (!raw) return { title: "", text: "" };

  const colonIndex = raw.indexOf(":");
  if (colonIndex === -1) {
    return { title: "", text: raw };
  }

  return {
    title: raw.slice(0, colonIndex).trim(),
    text: raw.slice(colonIndex + 1).trim(),
  };
}

export function normalizeCvContent(content: CvContent): CvContent {
  const experience = (content.experience ?? []).map((job) => ({
    ...job,
    bullets: ((job.bullets ?? []) as Array<string | ExperienceBullet>).map(
      (bullet) => normalizeExperienceBullet(bullet)
    ),
  })) as ExperienceItem[];

  return {
    ...content,
    experience,
  };
}
