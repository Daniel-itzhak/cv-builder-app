import type { CvContent } from "./cv-types";
import { DEFAULT_ICONS, DEFAULT_THEME_COLORS } from "./cv-types";

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
