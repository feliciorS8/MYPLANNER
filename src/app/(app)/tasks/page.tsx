import { Suspense } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskStatusFilter } from "@/components/task-status-filter";
import { tasks, type TaskStatus } from "@/lib/tasks-data";

function statusVariant(status: TaskStatus): "default" | "secondary" | "outline" {
  if (status === "Selesai") return "default";
  if (status === "Berjalan") return "secondary";
  return "outline";
}

function priorityBadgeClass(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high":
      return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "low":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "";
  }
}

function priorityLabel(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high":
      return "Tinggi";
    case "medium":
      return "Sedang";
    case "low":
      return "Rendah";
  }
}

type TasksPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

async function TaskListSection({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const currentFilter = resolvedParams?.status;

  const filteredTasks = currentFilter
    ? tasks.filter((t) => t.status === currentFilter)
    : tasks;

  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/40">
        <p className="text-sm font-semibold">Tidak ada tugas dengan status ini</p>
        <p className="text-xs text-muted-foreground mt-1">
          Coba pilih filter lain atau tambahkan tugas baru melalui form di samping.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3.5">
      {filteredTasks.map((task) => (
        <Link key={task.id} href={`/tasks/${task.id}`}>
          <Card className="group relative overflow-hidden border border-border/70 bg-card/90 hover:border-primary/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                  {task.title}
                </CardTitle>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
              <Badge variant={statusVariant(task.status)} className="shrink-0 text-[11px]">
                {task.status}
              </Badge>
            </CardHeader>

            <CardContent className="p-4 pt-2 text-xs text-muted-foreground flex flex-wrap items-center gap-3 border-t border-border/40 mt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="size-3.5 text-muted-foreground" />
                <span>Deadline: {task.deadline}</span>
              </span>

              <span>•</span>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${priorityBadgeClass(
                  task.priority
                )}`}
              >
                <Flag className="size-3" />
                <span>Prioritas {priorityLabel(task.priority)}</span>
              </span>

              <span className="ml-auto text-[11px] text-muted-foreground/80 group-hover:text-foreground transition-colors flex items-center gap-1">
                <span>Lihat detail</span>
                <Sparkles className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function TasksPage({ searchParams }: TasksPageProps) {
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "Berjalan").length;
  const completedTasks = tasks.filter((t) => t.status === "Selesai").length;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span>Daftar Tugas</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full border border-border bg-muted/50 text-muted-foreground">
              {totalTasks} total tugas
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola tugas kuliah dan pekerjaanmu dengan deadline yang jelas.
          </p>
        </div>
      </div>

      {/* Tiga Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* Total Tugas */}
        <Card className="relative overflow-hidden border border-border/70 bg-card/80 backdrop-blur-sm shadow-xs">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Tugas</span>
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ListTodo className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight">{totalTasks}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tugas tercatat dalam sistem</p>
          </CardContent>
        </Card>

        {/* Sedang Berjalan */}
        <Card className="relative overflow-hidden border border-border/70 bg-card/80 backdrop-blur-sm shadow-xs">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sedang Berjalan</span>
            <span className="grid size-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {inProgressTasks}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Membutuhkan fokus dan aksi</p>
          </CardContent>
        </Card>

        {/* Telah Selesai */}
        <Card className="relative overflow-hidden border border-border/70 bg-card/80 backdrop-blur-sm shadow-xs">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Telah Selesai</span>
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {completedTasks}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Target berhasil diselesaikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid 2 Kolom: Kiri Form, Kanan Daftar Tugas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Form Buat Tugas */}
        <div className="lg:col-span-1 sticky top-20">
          <CreateTaskForm />
        </div>

        {/* Kolom Kanan: Filter & Daftar Tugas */}
        <div className="lg:col-span-2 space-y-4">
          <Suspense fallback={<div className="h-10 rounded-xl bg-muted/40 animate-pulse" />}>
            <TaskStatusFilter />
          </Suspense>

          <Suspense
            fallback={
              <div className="space-y-3">
                <div className="h-24 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                <div className="h-24 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
              </div>
            }
          >
            <TaskListSection searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
