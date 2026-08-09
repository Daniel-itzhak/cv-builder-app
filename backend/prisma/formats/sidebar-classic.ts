/**
 * CV format derived from /cv.html (Daniel Itzhak sample).
 * Two-column A4: 30% sidebar + 70% main content.
 */
export const sidebarClassicFormat = {
  name: "Sidebar Classic",
  isActive: true,
  layoutConfig: {
    version: 1,
    source: "cv.html",
    page: {
      size: "A4",
      width: "210mm",
      height: "297mm",
      margin: "0",
      printColorAdjust: "exact",
    },
    layout: {
      type: "two-column-table",
      className: "main-table",
      columns: [
        {
          id: "sidebar",
          className: "sidebar-cell",
          width: "30%",
          role: "sidebar",
        },
        {
          id: "main",
          className: "content-cell",
          width: "70%",
          role: "main",
        },
      ],
    },
    theme: {
      fontFamily: "Arial, Helvetica, sans-serif",
      baseFontSize: "9.5pt",
      lineHeight: 1.45,
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
    spacing: {
      sidebarPadding: "22mm 10mm 20mm 12mm",
      contentPadding: "22mm 16mm 20mm 16mm",
      sidebarSectionGap: "22px",
      jobBlockGap: "18px",
      sectionTitleBorderWidth: "1.5px",
    },
    typography: {
      name: {
        fontSize: "26pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "heading",
      },
      subtitle: {
        fontSize: "13pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "accent",
      },
      sidebarTitle: {
        fontSize: "11pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        color: "heading",
        borderBottom: "1.5px solid heading",
      },
      contentTitle: {
        fontSize: "12pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        color: "heading",
        borderBottom: "1.5px solid heading",
      },
      jobTitle: {
        fontSize: "10.5pt",
        fontWeight: "bold",
        color: "heading",
      },
      companyName: {
        fontSize: "9.5pt",
        fontWeight: "bold",
        fontStyle: "italic",
        color: "accent",
      },
      meta: {
        fontSize: "8.5pt",
        fontStyle: "italic",
        color: "muted",
      },
    },
    /** Column placement for renderer */
    sections: {
      sidebar: [
        "contact",
        "skills",
        "education",
        "military",
        "otherExperience",
        "languages",
      ],
      main: ["header", "summary", "experience"],
    },
    /** Expected shape of Cv.content when using this template */
    contentSchema: {
      header: {
        fullName: "string",
        title: "string",
      },
      contact: {
        phone: "string?",
        email: "string?",
        linkedin: { label: "string", url: "string" },
        website: { label: "string", url: "string" },
      },
      summary: "string",
      skills: [
        {
          category: "string",
          items: "string",
        },
      ],
      education: [
        {
          degree: "string",
          institution: "string",
          dates: "string",
          description: "string?",
        },
      ],
      military: [
        {
          role: "string",
          dates: "string",
          description: "string?",
        },
      ],
      otherExperience: [
        {
          role: "string",
          dates: "string",
          description: "string?",
        },
      ],
      languages: [
        {
          language: "string",
          level: "string",
        },
      ],
      experience: [
        {
          title: "string",
          company: "string",
          dates: "string",
          companyDescription: "string?",
          bullets: ["string"],
        },
      ],
    },
  },
  thumbnailSchema: {
    preview: "two-column",
    aspectRatio: "210:297",
    sidebarRatio: 0.3,
    colors: {
      sidebar: "#f4f6f8",
      main: "#ffffff",
      accent: "#16a085",
      heading: "#2c3e50",
      border: "#e2e8f0",
    },
    blocks: [
      {
        column: "sidebar",
        type: "stack",
        items: ["title", "lines", "title", "lines", "title", "lines"],
      },
      {
        column: "main",
        type: "stack",
        items: ["name", "subtitle", "title", "paragraph", "title", "job", "job"],
      },
    ],
  },
} as const;
