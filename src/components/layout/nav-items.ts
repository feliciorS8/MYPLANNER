import {
  CalendarDays,
  ListTodo,
  Settings,
  Sun,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: readonly NavItem[] = [
  { title: "Hari Ini", href: "/hari-ini", icon: Sun },
  { title: "Tasks", href: "/tasks", icon: ListTodo },
  { title: "Kalender", href: "/kalender", icon: CalendarDays },
  { title: "Pengaturan", href: "/pengaturan", icon: Settings },
];

/** Menu dianggap aktif bila path sama persis atau berada di bawahnya. */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

