import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { safeNextPath } from "@/lib/navigation";
import { createClient } from "@/utils/supabase/server";

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  // Lapisan kedua: jika sudah login, langsung arahkan
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath);
  }

  return (
    <Card className="w-full max-w-md border-border/70 bg-card/80 shadow-xl backdrop-blur-md">
      <CardHeader className="space-y-3">
        <Badge variant="secondary" className="w-fit gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Tahap 2: Kredensial Mandiri
        </Badge>
        <CardTitle className="text-2xl font-black tracking-tight">
          MyPlanner
        </CardTitle>
        <CardDescription>
          Masuk atau buat akun untuk mengelola tugas dan jadwalmu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailPasswordForm next={nextPath} />
      </CardContent>
    </Card>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-muted" />
        }
      >
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
