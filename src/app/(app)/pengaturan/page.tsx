import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pengaturan" };

export default function PengaturanPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Pengaturan</h1>
      <p className="text-sm text-muted-foreground">
        Pengaturan akun dan preferensi aplikasi akan tampil di sini.
      </p>
    </section>
  );
}

