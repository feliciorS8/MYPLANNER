import Link from "next/link";
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
        <ThemeToggle />
      </header>
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
