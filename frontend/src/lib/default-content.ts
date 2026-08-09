import type {
  CvContent,
  ExperienceBullet,
  ExperienceItem,
} from "./cv-types";
import { DEFAULT_ICONS, DEFAULT_THEME_COLORS } from "./cv-types";

/** Convert legacy string bullets ("Title: text") into { title, text }. */
export function normalizeExperienceBullet(
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
    bullets: (job.bullets ?? []).map((bullet) =>
      normalizeExperienceBullet(
        bullet as string | ExperienceBullet
      )
    ),
  })) as ExperienceItem[];

  return {
    ...content,
    experience,
  };
}

export const sidebarClassicDefaultContent: CvContent = {
  header: {
    fullName: "Your Name",
    title: "Your Title",
  },
  contact: {
    phone: "",
    email: "",
    linkedin: { label: "", url: "" },
    website: { label: "", url: "" },
  },
  summary: "",
  skills: [{ category: "Skills", items: "" }],
  education: [],
  military: [],
  otherExperience: [],
  languages: [],
  experience: [],
  theme: {
    colors: { ...DEFAULT_THEME_COLORS },
  },
  icons: { ...DEFAULT_ICONS },
};

export function mergeThemeColors(content: CvContent) {
  return {
    ...DEFAULT_THEME_COLORS,
    ...content.theme?.colors,
  };
}

export function mergeIcons(content: CvContent) {
  return {
    ...DEFAULT_ICONS,
    ...content.icons,
  };
}
