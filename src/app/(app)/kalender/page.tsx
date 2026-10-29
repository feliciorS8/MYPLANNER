import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kalender" };

export default function KalenderPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Kalender</h1>
      <p className="text-sm text-muted-foreground">
        Tampilan kalender untuk melihat jadwal dan deadline tugas akan tampil di
        sini.
      </p>
    </section>
  );
}

