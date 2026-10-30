import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers3,
  ListTodo,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Navbar Minimalis */}
      <header className="border-b border-border/80 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-xs">
            M
          </span>
          <span className="font-bold text-lg tracking-tight">MyPlanner</span>
        </div>
        <Link
          href="/tasks"
          className={cn(
            buttonVariants({ size: "sm" }),
            "font-semibold text-xs gap-1.5"
          )}
        >
          <span>Buka Dashboard</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      {/* Hero Section dengan Preview Modul Form */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center space-y-10">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            <span>Modul 3 • Server Actions & Validasi Zod</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Rencanakan Tugasmu dengan{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Cerdas & Rapi
            </span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Platform perencanaan tugas berbasis Next.js 16 App Router dan Server Actions.
            Dilengkapi validasi formulir terintegrasi dan pengalaman pengguna yang responsif.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tasks"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 px-6 text-sm font-bold shadow-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white gap-2 transition-all hover:scale-105"
              )}
            >
              <PlusCircle className="size-4" />
              <span>Buka Form Tugas</span>
            </Link>
            <Link
              href="/hari-ini"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-6 text-sm font-semibold"
              )}
            >
              Lihat Agenda Hari Ini
            </Link>
          </div>
        </div>

        {/* Preview Modul Form Card */}
        <div className="w-full max-w-3xl pt-4">
          <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-xl text-left overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <CardHeader className="p-5 pb-3 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers3 className="size-4 text-indigo-500" />
                  <span>Preview Fitur Manajemen Tugas</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Validasi real-time pada server dengan feedback interaktif instan.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                <span>Siap Digunakan</span>
              </span>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-border/70 bg-card/80 space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                  <ListTodo className="size-4" />
                  <span>Validasi Zod Server</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Menjaga integritas data mulai dari panjang judul hingga format tanggal deadline.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/70 bg-card/80 space-y-1">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs">
                  <Clock className="size-4" />
                  <span>useActionState React 19</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Status pending dan feedback validasi langsung terintegrasi secara mulus.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/70 bg-card/80 space-y-1">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold text-xs">
                  <Sparkles className="size-4" />
                  <span>Auto Revalidate Cache</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Rute otomatis memperbarui data menggunakan revalidatePath(&quot;/tasks&quot;).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        MyPlanner • Praktikum Headless CMS UTS
      </footer>
    </div>
  );
}
