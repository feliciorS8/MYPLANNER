import { MobileNav } from "@/components/layout/mobile-nav";
import { AppBrand, Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:hidden">
          <MobileNav />
          <AppBrand />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

