import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/database.types";

type TaskStatus = Database["public"]["Tables"]["tasks"]["Row"]["status"];
type TaskPriority = Database["public"]["Tables"]["tasks"]["Row"]["priority"];

const statusLabel: Record<TaskStatus, string> = {
  todo: "Belum",
  in_progress: "Berjalan",
  done: "Selesai",
};

const priorityLabel: Record<TaskPriority, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

function statusVariant(status: TaskStatus): "default" | "secondary" | "outline" {
  if (status === "done") return "default";
  if (status === "in_progress") return "secondary";
  return "outline";
}

async function ProjectList() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, description, color, tasks(id, title, status, priority, deadline)")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">Koneksi ke Supabase gagal</p>
          <p className="text-xs">{error.message}</p>
        </div>
      </div>
    );
  }

  const allTasks = projects.flatMap((project) => project.tasks);
  const doneCount = allTasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Supabase terhubung
        </Badge>
        <span className="text-sm text-muted-foreground">
          {projects.length} proyek • {allTasks.length} tugas • {doneCount} selesai
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="transition-all hover:-translate-y-1 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{project.description}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border p-2.5"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Prioritas {priorityLabel[task.priority]} • {task.deadline ?? "Tanpa deadline"}
                    </p>
                  </div>
                  <Badge variant={statusVariant(task.status)}>{statusLabel[task.status]}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 p-6 md:p-10">
      <header className="space-y-3">
        <Badge variant="outline">MyPlanner • Minggu 04</Badge>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">MyPlanner</h1>
        <p className="max-w-xl text-muted-foreground">
          Manajemen planning untuk mahasiswa dan pekerja. Data di bawah ini dibaca langsung dari
          database Supabase PostgreSQL.
        </p>
        <Link
          href="/tasks"
          className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Buka Dashboard Tugas
        </Link>
      </header>

      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-muted" />}>
        <ProjectList />
      </Suspense>
    </main>
  );
}
