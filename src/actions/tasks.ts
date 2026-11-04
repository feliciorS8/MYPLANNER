"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { TaskSchema, TaskStatusSchema, type ActionState } from "@/lib/schemas";
import { createClient } from "@/utils/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

// Menentukan proyek tujuan: proyek pilihan (jika milik user), proyek pertama
// milik user, atau membuat "Proyek Utama (General)" otomatis
async function resolveTargetProjectId(
  supabase: ServerSupabase,
  userId: string,
  customProjectId?: string
): Promise<string | null> {
  if (customProjectId) {
    const { data: chosen } = await supabase
      .from("projects")
      .select("id")
      .eq("id", customProjectId)
      .eq("user_id", userId)
      .maybeSingle();
    if (chosen) return chosen.id;
  }

  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      title: "Proyek Utama (General)",
      description: "Proyek bawaan untuk tugas yang belum dikelompokkan.",
      color: "#6366f1",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Gagal membuat proyek default:", error.message);
    return null;
  }
  return created.id;
}

export async function createTaskAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    title: readField(formData, "title"),
    description: readField(formData, "description"),
    priority: readField(formData, "priority") || "medium",
    status: readField(formData, "status") || "todo",
    deadline: readField(formData, "deadline"),
    project_id: readField(formData, "project_id") || undefined,
  };
  const fields = {
    title: raw.title,
    description: raw.description,
    priority: raw.priority,
    deadline: raw.deadline,
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Sesi kamu berakhir. Silakan masuk lagi.",
      fields,
    };
  }

  const parsed = TaskSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi formulir gagal. Periksa kembali input Anda.",
      errors: parsed.error.flatten().fieldErrors,
      fields,
    };
  }

  const projectId = await resolveTargetProjectId(
    supabase,
    user.id,
    parsed.data.project_id
  );
  if (!projectId) {
    return {
      success: false,
      message: "Gagal menyiapkan proyek tujuan. Coba lagi.",
      fields,
    };
  }

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    status: parsed.data.status,
    priority: parsed.data.priority,
    deadline: parsed.data.deadline,
  });

  if (error) {
    console.error("Gagal menyimpan tugas:", error.message);
    return {
      success: false,
      message: "Gagal menyimpan tugas ke database. Coba lagi.",
      fields,
    };
  }

  revalidatePath("/tasks");

  return {
    success: true,
    message: "Tugas berhasil dibuat dan disimpan!",
  };
}

// Otorisasi dijaga oleh RLS di database:
// member hanya bisa menghapus tugas di proyek miliknya, admin bisa semuanya.
export async function deleteTaskAction(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Ftasks");

  if (!z.string().uuid().safeParse(id).success) return;

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus tugas:", error.message);
  }

  revalidatePath("/tasks");
}

export async function toggleTaskStatusAction(
  id: string,
  currentStatus: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Ftasks");

  const parsedStatus = TaskStatusSchema.safeParse(currentStatus);
  if (!parsedStatus.success || !z.string().uuid().safeParse(id).success) return;

  const nextStatus = parsedStatus.data === "done" ? "todo" : "done";

  const { error } = await supabase
    .from("tasks")
    .update({ status: nextStatus })
    .eq("id", id);
  if (error) {
    console.error("Gagal memperbarui status:", error.message);
  }

  revalidatePath("/tasks");
}
