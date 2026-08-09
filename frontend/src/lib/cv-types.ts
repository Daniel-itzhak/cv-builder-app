export type LinkField = {
  label: string;
  url: string;
};

export type SkillGroup = {
  category: string;
  items: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  dates: string;
  description?: string;
};

export type RoleItem = {
  role: string;
  dates: string;
  description?: string;
};

export type LanguageItem = {
  language: string;
  level: string;
};

export type ExperienceItem = {
  title: string;
  company: string;
  dates: string;
  companyDescription?: string;
  bullets: string[];
};

export type CvThemeColors = {
  pageBg: string;
  text: string;
  heading: string;
  accent: string;
  muted: string;
  body: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarBorder: string;
};

export type CvContactIcons = {
  phone: string;
  email: string;
  linkedin: string;
  website: string;
};

export type CvContent = {
  header?: {
    fullName: string;
    title: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    linkedin?: LinkField;
    website?: LinkField;
  };
  summary?: string;
  skills?: SkillGroup[];
  education?: EducationItem[];
  military?: RoleItem[];
  otherExperience?: RoleItem[];
  languages?: LanguageItem[];
  experience?: ExperienceItem[];
  theme?: {
    colors?: Partial<CvThemeColors>;
  };
  icons?: Partial<CvContactIcons>;
};

export type ThumbnailSchema = {
  preview?: string;
  aspectRatio?: string;
  sidebarRatio?: number;
  colors?: {
    sidebar?: string;
    main?: string;
    accent?: string;
    heading?: string;
    border?: string;
  };
  blocks?: Array<{
    column: "sidebar" | "main";
    type: string;
    items: string[];
  }>;
};

export type CvFormatSummary = {
  id: string;
  name: string;
  thumbnailSchema: ThumbnailSchema;
  layoutConfig?: unknown;
  isActive?: boolean;
  createdAt?: string;
};

export type CvListItem = {
  id: string;
  title: string;
  summary: string | null;
  templateId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
    thumbnailSchema: ThumbnailSchema;
  } | null;
};

export type CvDetail = {
  id: string;
  title: string;
  summary: string | null;
  templateId: string | null;
  content: CvContent;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  template: {
    id: string;
    name: string;
    layoutConfig: unknown;
    thumbnailSchema: ThumbnailSchema;
  } | null;
};

export const DEFAULT_THEME_COLORS: CvThemeColors = {
  pageBg: "#ffffff",
  text: "#333333",
  heading: "#2c3e50",
  accent: "#16a085",
  muted: "#718096",
  body: "#2d3748",
  sidebarBg: "#f4f6f8",
  sidebarText: "#4a5568",
  sidebarBorder: "#e2e8f0",
};

export const DEFAULT_ICONS: CvContactIcons = {
  phone: "phone",
  email: "mail",
  linkedin: "linkedin",
  website: "globe",
};

export const COLOR_LABELS: Record<keyof CvThemeColors, string> = {
  pageBg: "Page background",
  text: "Body text",
  heading: "Headings",
  accent: "Accent",
  muted: "Muted text",
  body: "Main body",
  sidebarBg: "Sidebar background",
  sidebarText: "Sidebar text",
  sidebarBorder: "Sidebar border",
};
