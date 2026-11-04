import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-black text-lg tracking-tight">
            MyPlanner
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/hari-ini" className="hover:text-foreground transition-colors">Hari Ini</Link>
            <Link href="/tasks" className="hover:text-foreground transition-colors">Tugas</Link>
            <Link href="/kalender" className="hover:text-foreground transition-colors">Kalender</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
