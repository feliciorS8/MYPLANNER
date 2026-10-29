import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hari Ini" };

export default function HariIniPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Hari Ini</h1>
      <p className="text-sm text-muted-foreground">
        Daftar tugas yang perlu kamu selesaikan hari ini akan tampil di sini.
      </p>
    </section>
  );
}

