import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database, WorkflowStatus } from "@/supabase/types";
import { helloWorldGraph } from "@/lib/workflows";
import { isSupabaseConfigured } from "@/supabase/env";

export const dynamic = "force-dynamic";

const missingConfigResponse = NextResponse.json(
  { error: "Supabase environment variables are not configured." },
  { status: 500 },
);

const unauthorizedResponse = NextResponse.json(
  { error: "Unauthorized" },
  { status: 401 },
);

// Helper to create the client inside Route Handlers
const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient<Database>(
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
              // Typescript incorrectly thinks this is ReadonlyRequestCookies
              // but in a Route Handler, we can mutate it.
              (cookieStore as any).set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export async function GET() {
  if (!isSupabaseConfigured) {
    return missingConfigResponse;
  }

  // 1. Await cookies (Next.js 15 fix)
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 2. Validate User with getUser()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorizedResponse;
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ workflows: data ?? [] });
}

type CreateWorkflowPayload = {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  graph?: unknown;
  inngest_trigger?: string | null;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return missingConfigResponse;
  }

  // 1. Await cookies
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 2. Validate User
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorizedResponse;
  }

  const body = (await request.json().catch(() => ({}))) as CreateWorkflowPayload;

  const payload = {
    user_id: user.id,
    name: body.name?.trim() || "Untitled workflow",
    description: body.description?.trim() || null,
    status: body.status || "draft",
    graph: body.graph ?? helloWorldGraph,
    inngest_trigger: body.inngest_trigger ?? "api/hello.world",
  } satisfies Database["public"]["Tables"]["workflows"]["Insert"];

  const { data, error } = await supabase
    .from("workflows")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ workflow: data });
}