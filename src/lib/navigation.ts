export const DEFAULT_AFTER_LOGIN = "/hari-ini";

// Hanya menerima path internal. Mencegah open redirect dan loop ke /login
export function safeNextPath(value: string | null | undefined): string {
  if (
    value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/\\") &&
    !value.startsWith("/login")
  ) {
    return value;
  }
  return DEFAULT_AFTER_LOGIN;
}

