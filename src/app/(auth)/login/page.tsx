import { Suspense } from "react";
import Link from "next/link";
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
import { createClient } from "@/utils/supabase/server";

// Lapisan kedua: jika sudah login, langsung arahkan ke aplikasi
async function AuthGate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/hari-ini");
  }

  return null;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="w-fit gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Tahap 1: Proxy Refresher Siap
          </Badge>
          <CardTitle className="text-xl">
            Authentication Gateway: Fondasi Keamanan Proxy Aktif
          </CardTitle>
          <CardDescription>
            Rute privat MyPlanner sudah dilindungi. Form login dan registrasi
            akan dibuat di Tahap 2.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Kembali ke beranda
          </Link>
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        <AuthGate />
      </Suspense>
    </main>
  );
}

