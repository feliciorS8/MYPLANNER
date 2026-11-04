import { z } from "zod";

// Domain virtual untuk login memakai NIM
export const NIM_DOMAIN = "student.ac.id";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIM_PATTERN = /^[a-zA-Z0-9]+$/;

// "budi@gmail.com" tetap email, "202401001" menjadi "202401001@student.ac.id"
export function resolveEmail(identifier: string): string {
  const value = identifier.trim().toLowerCase();
  return value.includes("@") ? value : `${value}@${NIM_DOMAIN}`;
}

const identifierSchema = z
  .string()
  .trim()
  .min(3, "Email atau NIM minimal 3 karakter")
  .max(100, "Email atau NIM maksimal 100 karakter")
  .refine(
    (value) =>
      value.includes("@") ? EMAIL_PATTERN.test(value) : NIM_PATTERN.test(value),
    "Format tidak valid. Gunakan email lengkap atau NIM berisi huruf dan angka saja"
  );

const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(72, "Password maksimal 72 karakter");

export const LoginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export const SignupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(80, "Nama lengkap maksimal 80 karakter"),
  identifier: identifierSchema,
  password: passwordSchema,
});

