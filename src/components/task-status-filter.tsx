"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

const filters = [
  { value: "all", label: "Semua" },
  { value: "Belum Mulai", label: "Belum Mulai" },
  { value: "Berjalan", label: "Berjalan" },
  { value: "Selesai", label: "Selesai" },
];

export function TaskStatusFilter() {
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  return (
    <nav
      aria-label="Filter status tugas"
      className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-xl border border-border/70 bg-card/50 p-1.5 backdrop-blur-sm shadow-xs"
    >
      {filters.map((filter) => {
        const isActive = currentStatus === filter.value;
        const href =
          filter.value === "all" ? "/tasks" : `/tasks?status=${encodeURIComponent(filter.value)}`;

        return (
          <Link
            key={filter.value}
            href={href}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={buttonVariants({
              variant: isActive ? "default" : "ghost",
              size: "sm",
              className: `h-8 shrink-0 rounded-lg px-3 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`,
            })}
          >
            <span>{filter.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

