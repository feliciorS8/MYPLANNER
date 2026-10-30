import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul tugas minimal harus 3 karakter")
    .max(100, "Judul tugas maksimal 100 karakter"),
  description: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
  priority: z
    .enum(["low", "medium", "high"], {
      message: "Pilih prioritas yang valid (rendah, sedang, tinggi)",
    })
    .default("medium"),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline wajib diisi dengan tanggal yang valid"),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Partial<Record<string, string[]>>;
  fields?: Record<string, string>;
  data?: T;
};

