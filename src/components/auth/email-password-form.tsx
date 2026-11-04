"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  loginWithEmailAction,
  signupWithEmailAction,
} from "@/actions/auth";
import type { ActionState } from "@/lib/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{messages[0]}</span>
    </p>
  );
}

export function EmailPasswordForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("login");

  const [loginState, loginAction, loginPending] = useActionState<
    ActionState | null,
    FormData
  >(loginWithEmailAction, null);

  const [signupState, signupAction, signupPending] = useActionState<
    ActionState | null,
    FormData
  >(signupWithEmailAction, null);

  const state = mode === "login" ? loginState : signupState;
  const formAction = mode === "login" ? loginAction : signupAction;
  const isPending = mode === "login" ? loginPending : signupPending;

  const errorClass = "border-destructive focus-visible:ring-destructive";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "login" ? "default" : "ghost"}
          onClick={() => setMode("login")}
        >
          Masuk
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "signup" ? "default" : "ghost"}
          onClick={() => setMode("signup")}
        >
          Daftar Akun Baru
        </Button>
      </div>

      <form key={mode} action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold">
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Budi Santoso"
              defaultValue={state?.fields?.fullName ?? ""}
              disabled={isPending}
              className={state?.errors?.fullName ? errorClass : ""}
            />
            <FieldError messages={state?.errors?.fullName} />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-xs font-semibold">
            Email atau NIM (Nomor Induk Mahasiswa)
          </Label>
          <Input
            id="identifier"
            name="identifier"
            autoComplete="username"
            placeholder="budi@gmail.com atau 202401001"
            defaultValue={state?.fields?.identifier ?? ""}
            disabled={isPending}
            className={state?.errors?.identifier ? errorClass : ""}
          />
          <FieldError messages={state?.errors?.identifier} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="Minimal 8 karakter"
            disabled={isPending}
            className={state?.errors?.password ? errorClass : ""}
          />
          <FieldError messages={state?.errors?.password} />
        </div>

        <Button type="submit" disabled={isPending} className="w-full gap-2">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending
            ? "Memproses..."
            : mode === "login"
              ? "Masuk"
              : "Daftar Sekarang"}
        </Button>

        {state?.success && (
          <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {state && !state.success && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Memakai NIM? Sistem otomatis memetakannya ke alamat kampus
        (NIM@student.ac.id).
      </p>
    </div>
  );
}

