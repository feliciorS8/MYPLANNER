import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      <p className="text-sm text-muted-foreground">
        Semua tugas beserta deadline, prioritas, dan kategorinya akan tampil di
        sini.
      </p>
    </section>
  );
}

