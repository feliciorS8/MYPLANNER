import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

// Rute yang wajib login. Rute lain (/, /login, /register, callback) bersifat publik.
const PRIVATE_ROUTES = ["/hari-ini", "/tasks", "/kalender", "/pengaturan"];
const AUTH_ROUTES = ["/login", "/register"];
const DEFAULT_AFTER_LOGIN = "/hari-ini";

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// Hanya menerima path internal, mencegah open redirect ke situs lain
function safeNextPath(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return DEFAULT_AFTER_LOGIN;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Dual-cookie: tulis token baru ke request DAN response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Wajib getUser() (diverifikasi ke server Supabase), bukan getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  // Redirect yang tetap membawa cookie sesi yang baru diperbarui
  const redirectTo = (target: URL): NextResponse => {
    const redirectResponse = NextResponse.redirect(target);
    response.cookies
      .getAll()
      .forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  };

  if (!user && matchesRoute(pathname, PRIVATE_ROUTES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return redirectTo(loginUrl);
  }

  if (user && matchesRoute(pathname, AUTH_ROUTES)) {
    const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));
    return redirectTo(new URL(nextPath, request.url));
  }

  return response;
}

