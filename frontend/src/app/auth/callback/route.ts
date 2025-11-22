import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr"; // Changed from auth-helpers
import { cookies } from "next/headers";
import type { Database } from "@/supabase/types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("next") ?? "/dashboard";
  const destination = new URL(redirectTo, requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(destination);
  }

  // 1. Await the cookie store (Next.js 15 requirement)
  const cookieStore = await cookies();

  // 2. Create the client using @supabase/ssr
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This suppresses errors if called from a context 
            // where cookies strictly can't be set, though in a 
            // Route Handler this usually works fine.
          }
        },
      },
    }
  );

  try {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error("Failed to exchange OAuth code", error);
    destination.searchParams.set("auth_error", "true");
    return NextResponse.redirect(destination);
  }
}