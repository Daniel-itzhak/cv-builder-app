import type { CvContent } from "../types/cv";

/** Starter content for Sidebar Classic so the preview is usable immediately. */
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
    colors: {
      pageBg: "#ffffff",
      text: "#333333",
      heading: "#2c3e50",
      accent: "#16a085",
      muted: "#718096",
      body: "#2d3748",
      sidebarBg: "#f4f6f8",
      sidebarText: "#4a5568",
      sidebarBorder: "#e2e8f0",
    },
  },
  icons: {
    phone: "phone",
    email: "mail",
    linkedin: "linkedin",
    website: "globe",
  },
};
