import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"], {
  message: "Status tugas tidak valid",
});

export const TaskPrioritySchema = z.enum(["low", "medium", "high"], {
  message: "Pilih prioritas yang valid (rendah, sedang, tinggi)",
});

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
  priority: TaskPrioritySchema.default("medium"),
  status: TaskStatusSchema.default("todo"),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline wajib diisi dengan tanggal yang valid")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Tanggal tidak valid"),
  project_id: z.string().uuid("ID proyek tidak valid").optional(),
});

export const TaskUpdateSchema = TaskSchema.partial();

export type TaskInput = z.infer<typeof TaskSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;

export type ActionState<T = unknown> = {
  success: boolean;
  message: string;
  errors?: Partial<Record<string, string[]>>;
  fields?: Record<string, string>;
  data?: T;
};
