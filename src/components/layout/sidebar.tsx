"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavItemActive, navItems } from "@/components/layout/nav-items";

export function AppBrand() {
  return (
    <Link
      href="/hari-ini"
      className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <CheckSquare className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base font-semibold tracking-tight">MyPlanner</span>
    </Link>
  );
}

type SidebarNavProps = {
  /** Dipanggil setelah menu diklik, misalnya untuk menutup Sheet di mobile. */
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isNavItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-sidebar-primary" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground md:flex">
      <div className="px-2">
        <AppBrand />
      </div>
      <SidebarNav />
      <p className="mt-auto px-3 text-xs text-muted-foreground">
        Rencanakan hari, selesaikan tugas.
      </p>
    </aside>
  );
}

