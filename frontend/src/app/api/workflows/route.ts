import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
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

export async function GET() {
  if (!isSupabaseConfigured) {
    return missingConfigResponse;
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return unauthorizedResponse;
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", session.user.id)
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

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return unauthorizedResponse;
  }

  const body = (await request.json().catch(() => ({}))) as CreateWorkflowPayload;

  const payload = {
    user_id: session.user.id,
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

