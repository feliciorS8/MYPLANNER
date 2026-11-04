"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { LoginSchema, SignupSchema, resolveEmail } from "@/lib/auth-schemas";
import { safeNextPath } from "@/lib/navigation";
import type { ActionState } from "@/lib/schemas";

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function translateAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Email/NIM atau password salah.";
  }
  if (text.includes("email not confirmed")) {
    return "Akun belum diverifikasi. Matikan 'Confirm email' di Supabase untuk mode development.";
  }
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Email atau NIM ini sudah terdaftar. Silakan masuk.";
  }
  if (text.includes("rate limit")) {
    return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
  }
  return "Terjadi kesalahan pada server autentikasi. Coba lagi.";
}

export async function loginWithEmailAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    identifier: readField(formData, "identifier"),
    password: readField(formData, "password"),
  };
  const next = safeNextPath(readField(formData, "next") || null);

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang kamu isi.",
      errors: parsed.error.flatten().fieldErrors,
      fields: { identifier: raw.identifier },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: resolveEmail(parsed.data.identifier),
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: translateAuthError(error.message),
      fields: { identifier: raw.identifier },
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signupWithEmailAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    fullName: readField(formData, "fullName"),
    identifier: readField(formData, "identifier"),
    password: readField(formData, "password"),
  };
  const next = safeNextPath(readField(formData, "next") || null);

  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang kamu isi.",
      errors: parsed.error.flatten().fieldErrors,
      fields: { fullName: raw.fullName, identifier: raw.identifier },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: resolveEmail(parsed.data.identifier),
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    return {
      success: false,
      message: translateAuthError(error.message),
      fields: { fullName: raw.fullName, identifier: raw.identifier },
    };
  }

  // Auto-confirm aktif: sesi langsung terbentuk, masuk ke aplikasi
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(next);
  }

  // Confirm email aktif: pengguna harus memverifikasi dulu
  return {
    success: true,
    message: "Pendaftaran berhasil. Cek email kamu untuk verifikasi, lalu masuk.",
  };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

