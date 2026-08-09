"use client";

import type { CSSProperties } from "react";
import { getContactIcon } from "@/lib/contact-icons";
import { mergeIcons, mergeThemeColors } from "@/lib/default-content";
import type { CvContent } from "@/lib/cv-types";

type Props = {
  content: CvContent;
  className?: string;
  scale?: number;
};

export function SidebarClassicPreview({
  content,
  className,
  scale = 1,
}: Props) {
  const colors = mergeThemeColors(content);
  const icons = mergeIcons(content);
  const header = content.header ?? { fullName: "", title: "" };
  const contact = content.contact ?? {};
  const skills = content.skills ?? [];
  const education = content.education ?? [];
  const military = content.military ?? [];
  const otherExperience = content.otherExperience ?? [];
  const languages = content.languages ?? [];
  const experience = content.experience ?? [];
  const summary = content.summary ?? "";

  const PhoneIcon = getContactIcon(icons.phone);
  const EmailIcon = getContactIcon(icons.email);
  const LinkedinIcon = getContactIcon(icons.linkedin);
  const WebsiteIcon = getContactIcon(icons.website);

  const pageStyle: CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    background: colors.pageBg,
    color: colors.text,
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "9.5pt",
    lineHeight: 1.45,
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: "top left",
    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div className={className} style={pageStyle}>
      <table
        style={{
          width: "100%",
          minHeight: "297mm",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "30%",
                background: colors.sidebarBg,
                padding: "22mm 10mm 20mm 12mm",
                verticalAlign: "top",
                borderRight: `1px solid ${colors.sidebarBorder}`,
              }}
            >
              <SidebarSection title="Contact" colors={colors}>
                {contact.phone ? (
                  <ContactRow
                    Icon={PhoneIcon}
                    label="Phone"
                    colors={colors}
                    value={contact.phone}
                  />
                ) : null}
                {contact.email ? (
                  <ContactRow
                    Icon={EmailIcon}
                    label="Email"
                    colors={colors}
                    href={`mailto:${contact.email}`}
                    value={contact.email}
                  />
                ) : null}
                {contact.linkedin?.label || contact.linkedin?.url ? (
                  <ContactRow
                    Icon={LinkedinIcon}
                    label="LinkedIn"
                    colors={colors}
                    href={contact.linkedin.url || undefined}
                    value={contact.linkedin.label || contact.linkedin.url}
                  />
                ) : null}
                {contact.website?.label || contact.website?.url ? (
                  <ContactRow
                    Icon={WebsiteIcon}
                    label="Website"
                    colors={colors}
                    href={contact.website.url || undefined}
                    value={contact.website.label || contact.website.url}
                  />
                ) : null}
                {!contact.phone &&
                !contact.email &&
                !contact.linkedin?.label &&
                !contact.linkedin?.url &&
                !contact.website?.label &&
                !contact.website?.url ? (
                  <p style={{ margin: 0, color: colors.sidebarText, fontSize: "9pt" }}>
                    Add contact details
                  </p>
                ) : null}
              </SidebarSection>

              {skills.length > 0 ? (
                <SidebarSection title="Technical Skills" colors={colors}>
                  {skills.map((skill, index) => (
                    <p
                      key={`${skill.category}-${index}`}
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "9pt",
                        color: colors.sidebarText,
                      }}
                    >
                      <strong>{skill.category || "Category"}:</strong>
                      <br />
                      {skill.items || "—"}
                    </p>
                  ))}
                </SidebarSection>
              ) : null}

              {education.length > 0 ? (
                <SidebarSection title="Education" colors={colors}>
                  {education.map((item, index) => (
                    <p
                      key={`${item.degree}-${index}`}
                      style={{
                        margin: index === education.length - 1 ? 0 : "0 0 10px 0",
                        fontSize: "9pt",
                        color: colors.sidebarText,
                      }}
                    >
                      <strong>{item.degree || "Degree"}</strong>
                      <br />
                      <span style={{ color: colors.accent, fontStyle: "italic" }}>
                        {[item.institution, item.dates].filter(Boolean).join(" | ")}
                      </span>
                      {item.description ? (
                        <>
                          <br />
                          <span style={{ fontSize: "8.5pt", color: colors.muted }}>
                            {item.description}
                          </span>
                        </>
                      ) : null}
                    </p>
                  ))}
                </SidebarSection>
              ) : null}

              {military.length > 0 ? (
                <SidebarSection title="Military Service" colors={colors}>
                  {military.map((item, index) => (
                    <RoleBlock key={`${item.role}-${index}`} item={item} colors={colors} />
                  ))}
                </SidebarSection>
              ) : null}

              {otherExperience.length > 0 ? (
                <SidebarSection title="Experience" colors={colors}>
                  {otherExperience.map((item, index) => (
                    <RoleBlock key={`${item.role}-${index}`} item={item} colors={colors} />
                  ))}
                </SidebarSection>
              ) : null}

              {languages.length > 0 ? (
                <SidebarSection title="Languages" colors={colors} last>
                  {languages.map((item, index) => (
                    <p
                      key={`${item.language}-${index}`}
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "9pt",
                        color: colors.sidebarText,
                      }}
                    >
                      <strong>{item.language || "Language"}:</strong>{" "}
                      {item.level || "—"}
                    </p>
                  ))}
                </SidebarSection>
              ) : null}
            </td>

            <td
              style={{
                width: "70%",
                padding: "22mm 16mm 20mm 16mm",
                verticalAlign: "top",
                background: colors.pageBg,
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h1
                  style={{
                    fontSize: "26pt",
                    color: colors.heading,
                    margin: "0 0 2px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontWeight: "bold",
                  }}
                >
                  {header.fullName || "Your Name"}
                </h1>
                <div
                  style={{
                    fontSize: "13pt",
                    color: colors.accent,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {header.title || "Your Title"}
                </div>
              </div>

              <SectionTitle colors={colors}>Professional Summary</SectionTitle>
              <p
                style={{
                  textAlign: "justify",
                  margin: "0 0 12px 0",
                  color: colors.body,
                  fontSize: "9.5pt",
                }}
              >
                {summary || "Write a short professional summary…"}
              </p>

              <SectionTitle colors={colors}>Professional Experience</SectionTitle>
              {experience.length === 0 ? (
                <p style={{ color: colors.muted, fontSize: "9.5pt", margin: 0 }}>
                  Add your work experience
                </p>
              ) : (
                experience.map((job, index) => (
                  <div
                    key={`${job.company}-${index}`}
                    style={{
                      marginBottom: index === experience.length - 1 ? 0 : "18px",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: "2px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "10.5pt",
                              color: colors.heading,
                              textAlign: "left",
                            }}
                          >
                            {job.title || "Role"}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              color: colors.muted,
                              fontWeight: "bold",
                              fontSize: "9.5pt",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {job.dates}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      style={{
                        fontStyle: "italic",
                        color: colors.accent,
                        fontWeight: "bold",
                        marginBottom: "2px",
                        fontSize: "9.5pt",
                      }}
                    >
                      {job.company || "Company"}
                    </div>
                    {job.companyDescription ? (
                      <p
                        style={{
                          fontSize: "8.5pt",
                          color: colors.muted,
                          fontStyle: "italic",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {job.companyDescription}
                      </p>
                    ) : null}
                    {job.bullets.filter(Boolean).length > 0 ? (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "15px",
                        }}
                      >
                        {job.bullets.filter(Boolean).map((bullet, bIndex) => (
                          <li
                            key={bIndex}
                            style={{
                              marginBottom: "5px",
                              textAlign: "justify",
                              color: colors.body,
                              fontSize: "9.5pt",
                            }}
                          >
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof mergeThemeColors>;
}) {
  return (
    <div
      style={{
        fontSize: "12pt",
        color: colors.heading,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        borderBottom: `1.5px solid ${colors.heading}`,
        paddingBottom: "4px",
        marginTop: "20px",
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}

function SidebarSection({
  title,
  colors,
  children,
  last,
}: {
  title: string;
  colors: ReturnType<typeof mergeThemeColors>;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : "22px" }}>
      <div
        style={{
          fontSize: "11pt",
          color: colors.heading,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          borderBottom: `1.5px solid ${colors.heading}`,
          paddingBottom: "4px",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
  colors,
}: {
  Icon: React.ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  value: string;
  href?: string;
  colors: ReturnType<typeof mergeThemeColors>;
}) {
  return (
    <div
      style={{
        margin: "0 0 7px 0",
        fontSize: "9pt",
        color: colors.sidebarText,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Icon style={{ width: 12, height: 12, flexShrink: 0, color: colors.accent }} />
      <span>
        <strong>{label}:</strong>&nbsp;
        {href ? (
          <a href={href} style={{ color: colors.accent, textDecoration: "none" }}>
            {value}
          </a>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function RoleBlock({
  item,
  colors,
}: {
  item: { role: string; dates: string; description?: string };
  colors: ReturnType<typeof mergeThemeColors>;
}) {
  return (
    <p style={{ margin: "0 0 8px 0", fontSize: "9pt", color: colors.sidebarText }}>
      <strong>{item.role || "Role"}</strong>
      <br />
      <span style={{ color: colors.accent, fontStyle: "italic" }}>{item.dates}</span>
      {item.description ? (
        <>
          <br />
          <span style={{ fontSize: "8.5pt", color: colors.muted }}>
            {item.description}
          </span>
        </>
      ) : null}
    </p>
  );
}
