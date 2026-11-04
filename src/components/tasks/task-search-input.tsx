"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";

export function TaskSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = term.trim();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    // Pencarian baru selalu kembali ke halaman 1
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari judul tugas..."
        aria-label="Cari tugas"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(event) => handleSearch(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}

