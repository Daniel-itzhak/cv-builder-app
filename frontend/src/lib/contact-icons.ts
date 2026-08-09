import {
  AtSign,
  Briefcase,
  ExternalLink,
  FolderGit2,
  Globe,
  Link2,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const CONTACT_ICON_OPTIONS: Array<{
  id: string;
  label: string;
  Icon: LucideIcon;
}> = [
  { id: "phone", label: "Phone", Icon: Phone },
  { id: "smartphone", label: "Mobile", Icon: Smartphone },
  { id: "mail", label: "Mail", Icon: Mail },
  { id: "linkedin", label: "LinkedIn", Icon: AtSign },
  { id: "globe", label: "Website", Icon: Globe },
  { id: "link", label: "Link", Icon: Link2 },
  { id: "external-link", label: "External", Icon: ExternalLink },
  { id: "github", label: "GitHub", Icon: FolderGit2 },
  { id: "map-pin", label: "Location", Icon: MapPin },
  { id: "briefcase", label: "Work", Icon: Briefcase },
];

const iconMap = Object.fromEntries(
  CONTACT_ICON_OPTIONS.map((opt) => [opt.id, opt.Icon])
) as Record<string, LucideIcon>;

export function getContactIcon(name: string): LucideIcon {
  return iconMap[name] ?? Link2;
}
