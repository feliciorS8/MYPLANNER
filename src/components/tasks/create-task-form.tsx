"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2, PlusCircle } from "lucide-react";
import { createTaskAction } from "@/actions/tasks";
import type { ActionState } from "@/lib/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      <span>{messages[0]}</span>
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-9 w-full gap-2 text-xs font-bold"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Menyimpan ke server..." : "Simpan Tugas"}
    </Button>
  );
}

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    createTaskAction,
    null
  );

  const errorClass = "border-destructive focus-visible:ring-destructive";

  return (
    <Card className="border border-border/80 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <PlusCircle className="h-4 w-4 text-indigo-500" />
          <span>Tambah Tugas Baru</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Judul Tugas
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Kerjakan laporan praktikum"
              defaultValue={state?.fields?.title ?? ""}
              disabled={isPending}
              className={state?.errors?.title ? errorClass : ""}
            />
            <FieldError messages={state?.errors?.title} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Deskripsi (opsional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Catatan singkat tentang tugas ini"
              rows={3}
              defaultValue={state?.fields?.description ?? ""}
              disabled={isPending}
              className={state?.errors?.description ? errorClass : ""}
            />
            <FieldError messages={state?.errors?.description} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-xs font-semibold">
                Prioritas
              </Label>
              <select
                id="priority"
                name="priority"
                defaultValue={state?.fields?.priority ?? "medium"}
                disabled={isPending}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
              <FieldError messages={state?.errors?.priority} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="text-xs font-semibold">
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={state?.fields?.deadline ?? ""}
                disabled={isPending}
                className={state?.errors?.deadline ? errorClass : ""}
              />
              <FieldError messages={state?.errors?.deadline} />
            </div>
          </div>

          <SubmitButton />

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
      </CardContent>
    </Card>
  );
}
