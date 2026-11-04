import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, CheckCircle2, Circle, Clock, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { deleteTaskAction, toggleTaskStatusAction } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskSearchInput } from "@/components/tasks/task-search-input";
import type { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type TaskStatus = TaskRow["status"];
type TaskPriority = TaskRow["priority"];

type TasksSearchParams = Promise<{ search?: string; page?: string }>;

const PAGE_SIZE = 10;

const statusMeta: Record<
  TaskStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  todo: { label: "Belum", icon: Circle, className: "text-muted-foreground" },
  in_progress: { label: "Berjalan", icon: Clock, className: "text-amber-500" },
  done: { label: "Selesai", icon: CheckCircle2, className: "text-emerald-500" },
};

const priorityLabel: Record<TaskPriority, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

const priorityVariant: Record<TaskPriority, "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

const pagerClass =
  "inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-muted";

function buildHref(page: number, term: string): string {
  const params = new URLSearchParams();
  if (term) params.set("search", term);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/tasks?${query}` : "/tasks";
}

async function TasksContent({ searchParams }: { searchParams: TasksSearchParams }) {
  const { search = "", page = "1" } = await searchParams;

  const term = search.trim().slice(0, 100);
  // Escape karakter wildcard agar pencarian "50%" tidak dianggap pola
  const likeTerm = term.replace(/[\\%_]/g, "\\$&");
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const from = (pageNumber - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Ftasks");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();
  const role = profile?.role ?? "member";

  let query = supabase
    .from("tasks")
    .select("id, title, status, priority, deadline, created_at", {
      count: "exact",
    });
  if (term) {
    query = query.ilike("title", `%${likeTerm}%`);
  }
  const { data, error, count } = await query
    .order("deadline", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  // PGRST103 = halaman di luar jangkauan, diperlakukan sebagai daftar kosong
  const hasRealError = error !== null && error.code !== "PGRST103";
  const tasks = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Tugas</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tugas kuliah dan pekerjaanmu dengan deadline yang jelas.
          </p>
        </div>
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role === "admin" ? "👑 Admin" : "👤 Member"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CreateTaskForm />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <TaskSearchInput />

          {hasRealError && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Gagal memuat tugas</p>
                <p className="text-xs">{error.message}</p>
              </div>
            </div>
          )}

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tugas</TableHead>
                  <TableHead>Prioritas</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      {term
                        ? `Tidak ada tugas yang cocok dengan "${term}".`
                        : "Belum ada tugas. Tambahkan tugas pertamamu lewat formulir."}
                    </TableCell>
                  </TableRow>
                )}

                {tasks.map((task) => {
                  const meta = statusMeta[task.status];
                  const StatusIcon = meta.icon;
                  const isOverdue =
                    task.deadline !== null &&
                    task.deadline < today &&
                    task.status !== "done";

                  return (
                    <TableRow key={task.id}>
                      <TableCell
                        className={`max-w-[16rem] truncate font-medium ${
                          task.status === "done"
                            ? "text-muted-foreground line-through"
                            : ""
                        }`}
                      >
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant[task.priority]}>
                          {priorityLabel[task.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-xs ${
                          isOverdue
                            ? "font-semibold text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {task.deadline ?? "-"}
                        {isOverdue && " (terlambat)"}
                      </TableCell>
                      <TableCell>
                        <form
                          action={toggleTaskStatusAction.bind(
                            null,
                            task.id,
                            task.status
                          )}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                          >
                            <StatusIcon className={`h-4 w-4 ${meta.className}`} />
                            {meta.label}
                          </Button>
                        </form>
                      </TableCell>
                      <TableCell>
                        <form action={deleteTaskAction.bind(null, task.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label={`Hapus tugas ${task.title}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Halaman {pageNumber} dari {totalPages} • {total} tugas
            </span>
            <div className="flex gap-2">
              {pageNumber > 1 ? (
                <Link href={buildHref(pageNumber - 1, term)} className={pagerClass}>
                  Sebelumnya
                </Link>
              ) : (
                <span className={`${pagerClass} pointer-events-none opacity-50`}>
                  Sebelumnya
                </span>
              )}
              {pageNumber < totalPages ? (
                <Link href={buildHref(pageNumber + 1, term)} className={pagerClass}>
                  Berikutnya
                </Link>
              ) : (
                <span className={`${pagerClass} pointer-events-none opacity-50`}>
                  Berikutnya
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage({
  searchParams,
}: {
  searchParams: TasksSearchParams;
}) {
  return (
    <Suspense
      fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}
    >
      <TasksContent searchParams={searchParams} />
    </Suspense>
  );
}
