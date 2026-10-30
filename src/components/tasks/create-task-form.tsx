"use client";

import { useActionState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileText,
  Flag,
  Loader2,
  PlusCircle,
  Sparkles,
  Type,
} from "lucide-react";
import { createTaskAction } from "@/actions/tasks";
import type { ActionState } from "@/lib/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-50 slide-in-from-top-1">
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{messages[0]}</span>
    </p>
  );
}

export function CreateTaskForm() {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    createTaskAction,
    null
  );

  const errorClass =
    "border-destructive/80 focus-visible:border-destructive focus-visible:ring-destructive/30";

  return (
    <Card className="relative overflow-hidden border border-border/70 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur-sm transition-all">
      {/* Pastel Gradient Accent Header Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500/70 via-purple-500/70 to-pink-500/70" />

      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-bold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-600 dark:text-indigo-400">
              <PlusCircle className="size-4" />
            </span>
            <span>Tambah Tugas Baru</span>
          </CardTitle>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
            <Sparkles className="size-3" />
            <span>Server Action</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Catat dan atur prioritas target belajarmu hari ini.
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <form action={formAction} className="space-y-4">
          {/* Judul Tugas */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="flex items-center gap-1.5 text-xs font-semibold">
              <Type className="size-3.5 text-indigo-500" />
              <span>Judul Tugas</span>
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Kerjakan laporan praktikum"
              defaultValue={state?.fields?.title ?? ""}
              disabled={isPending}
              aria-invalid={Boolean(state?.errors?.title)}
              className={`h-9.5 text-xs transition-all ${state?.errors?.title ? errorClass : ""}`}
            />
            <FieldError messages={state?.errors?.title} />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="flex items-center gap-1.5 text-xs font-semibold">
              <FileText className="size-3.5 text-purple-500" />
              <span>Deskripsi</span>
              <span className="text-[11px] font-normal text-muted-foreground">(opsional)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Catatan singkat tentang detail dan instruksi tugas..."
              rows={3}
              defaultValue={state?.fields?.description ?? ""}
              disabled={isPending}
              aria-invalid={Boolean(state?.errors?.description)}
              className={`text-xs resize-none transition-all ${
                state?.errors?.description ? errorClass : ""
              }`}
            />
            <FieldError messages={state?.errors?.description} />
          </div>

          {/* Prioritas & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="flex items-center gap-1.5 text-xs font-semibold">
                <Flag className="size-3.5 text-pink-500" />
                <span>Prioritas</span>
              </Label>
              <select
                id="priority"
                name="priority"
                defaultValue={state?.fields?.priority ?? "medium"}
                disabled={isPending}
                aria-invalid={Boolean(state?.errors?.priority)}
                className={`flex h-9.5 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 ${
                  state?.errors?.priority ? errorClass : ""
                }`}
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
              <FieldError messages={state?.errors?.priority} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline" className="flex items-center gap-1.5 text-xs font-semibold">
                <Calendar className="size-3.5 text-emerald-500" />
                <span>Deadline</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={state?.fields?.deadline ?? ""}
                disabled={isPending}
                aria-invalid={Boolean(state?.errors?.deadline)}
                className={`h-9.5 text-xs transition-all ${state?.errors?.deadline ? errorClass : ""}`}
              />
              <FieldError messages={state?.errors?.deadline} />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 gap-2 font-semibold text-xs shadow-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Menyimpan ke server...</span>
              </>
            ) : (
              <>
                <PlusCircle className="size-4" />
                <span>Simpan Tugas</span>
              </>
            )}
          </Button>

          {/* Feedback Alerts */}
          {state?.success && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 animate-in fade-in-50">
              <CheckCircle2 className="size-4" />
              <AlertTitle className="text-xs font-bold">Berhasil Disimpan!</AlertTitle>
              <AlertDescription className="text-xs">{state.message}</AlertDescription>
            </Alert>
          )}

          {state && !state.success && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertCircle className="size-4" />
              <AlertTitle className="text-xs font-bold">Perlu Diperiksa</AlertTitle>
              <AlertDescription className="text-xs">{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

