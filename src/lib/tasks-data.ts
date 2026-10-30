export type TaskStatus = "Belum Mulai" | "Berjalan" | "Selesai";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: TaskStatus;
  deadline: string;
};

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Menyusun Kerangka UI MyPlanner",
    description: "Mendesain sidebar, navigation, layout utama dan tema dark/light mode.",
    priority: "high",
    status: "Selesai",
    deadline: "2026-10-30",
  },
  {
    id: "task-2",
    title: "Implementasi Server Actions & Validasi Zod",
    description: "Membuat schema Zod untuk formulir input tugas dan menangani mutasi server.",
    priority: "medium",
    status: "Berjalan",
    deadline: "2026-11-02",
  },
  {
    id: "task-3",
    title: "Integrasi Database Supabase & PostgreSQL",
    description: "Menghubungkan aplikasi ke tabel tasks di Supabase dan menyiapkan trigger pengguna.",
    priority: "low",
    status: "Belum Mulai",
    deadline: "2026-11-08",
  },
];

