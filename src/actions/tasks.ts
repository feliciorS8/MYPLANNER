"use server";

import { revalidatePath } from "next/cache";
import { TaskSchema, type ActionState } from "@/lib/schemas";

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: readField(formData, "title"),
    description: readField(formData, "description"),
    priority: readField(formData, "priority") || "medium",
    deadline: readField(formData, "deadline"),
  };

  const validation = TaskSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi formulir gagal. Periksa kembali input Anda.",
      errors: validation.error.flatten().fieldErrors,
      fields: rawData,
    };
  }

  // Simulasi penyimpanan. Akan diganti insert ke Supabase di modul database.
  console.log("Menyimpan tugas baru ke server:", validation.data);

  // Revalidasi cache halaman tugas
  revalidatePath("/tasks");

  return {
    success: true,
    message: "Tugas berhasil dibuat dan disimpan!",
  };
}

