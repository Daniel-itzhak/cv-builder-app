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

/** Shape of Cv.content for sidebar-classic (and future compatible templates). */
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
  /** Per-CV color overrides (merged over format theme.colors). */
  theme?: {
    colors?: Partial<CvThemeColors>;
  };
  /** Lucide icon names for contact rows. */
  icons?: Partial<CvContactIcons>;
};
