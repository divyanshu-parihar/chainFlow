import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/supabase/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("next") ?? "/dashboard";
  const destination = new URL(redirectTo, requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(destination);
  }

  const supabase = createRouteHandlerClient<Database>({
    cookies: () => request.cookies as unknown,
  });

  try {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error("Failed to exchange OAuth code", error);
    destination.searchParams.set("auth_error", "true");
    return NextResponse.redirect(destination);
  }
}
