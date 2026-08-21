import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  CalendarCheck,
  Code2,
  FilePenLine,
  Gauge,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Palette,
  Phone,
  Puzzle,
  Rocket,
  SearchCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

export const serviceIcons = {
  puzzle: Puzzle,
  globe: Globe,
  smartphone: Smartphone,
  graduationCap: GraduationCap,
  sparkles: Sparkles,
  palette: Palette,
} as const;

export const aboutHighlightIcons = {
  searchCheck: SearchCheck,
  code2: Code2,
  rocket: Rocket,
} as const;

export const toolCardIcons = {
  code2: Code2,
  layoutDashboard: LayoutDashboard,
  gauge: Gauge,
} as const;

export const statCardIcons = {
  sparkles: Sparkles,
  blocks: Blocks,
  badgeCheck: BadgeCheck,
} as const;

export const contactMethodIcons = {
  messageCircle: MessageCircle,
  phone: Phone,
  mail: Mail,
  filePenLine: FilePenLine,
  calendarCheck: CalendarCheck,
} as const;

export type ServiceIconKey = keyof typeof serviceIcons;
export type AboutHighlightIconKey = keyof typeof aboutHighlightIcons;
export type ToolCardIconKey = keyof typeof toolCardIcons;
export type StatCardIconKey = keyof typeof statCardIcons;
export type ContactMethodIconKey = keyof typeof contactMethodIcons;

export type PortfolioIconKey =
  | ServiceIconKey
  | AboutHighlightIconKey
  | ToolCardIconKey
  | StatCardIconKey
  | ContactMethodIconKey;

const iconMap: Record<PortfolioIconKey, LucideIcon> = {
  ...serviceIcons,
  ...aboutHighlightIcons,
  ...toolCardIcons,
  ...statCardIcons,
  ...contactMethodIcons,
};

export function getPortfolioIcon(key: PortfolioIconKey): LucideIcon {
  return iconMap[key];
}
