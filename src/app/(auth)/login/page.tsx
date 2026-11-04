import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { GithubLoginButton } from "@/components/auth/github-login-button";
import { safeNextPath } from "@/lib/navigation";
import { createClient } from "@/utils/supabase/server";

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = safeNextPath(next);

  // Lapisan kedua: jika sudah login, langsung arahkan ke tujuan
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
          Tahap 3: Social OAuth GitHub
        </Badge>
        <CardTitle className="text-2xl font-black tracking-tight">
          MyPlanner
        </CardTitle>
        <CardDescription>
          Masuk atau buat akun untuk mengelola tugas dan jadwalmu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error === "oauth_callback_failed" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Gagal masuk dengan GitHub atau otorisasi dibatalkan. Silakan coba lagi.
            </AlertDescription>
          </Alert>
        )}

        {/* 1-Click Social OAuth GitHub Button */}
        <GithubLoginButton next={nextPath} />

        <div className="relative flex items-center justify-center py-1">
          <Separator className="w-full" />
          <span className="absolute bg-card px-2.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Atau lanjutkan dengan kredensial
          </span>
        </div>

        {/* Formulir Email & Password (Tahap 2) */}
        <EmailPasswordForm next={nextPath} />
      </CardContent>
    </Card>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
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
