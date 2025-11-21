import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database, WorkflowStatus } from "@/supabase/types";
import { isSupabaseConfigured } from "@/supabase/env";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: {
    id: string;
  };
};

type UpdatePayload = {
  name?: string;
  description?: string | null;
  status?: WorkflowStatus;
  graph?: unknown;
  inngest_trigger?: string | null;
};

export async function PUT(request: Request, { params }: RouteParams) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Supabase environment variables are not configured." },
      { status: 500 },
    );
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as UpdatePayload;
  const update: Database["public"]["Tables"]["workflows"]["Update"] = {
    updated_at: new Date().toISOString(),
  };

  if (typeof body.name === "string") {
    update.name = body.name.trim();
  }

  if ("description" in body) {
    update.description = body.description?.trim() || null;
  }

  if (body.status) {
    update.status = body.status;
  }

  if ("graph" in body) {
    update.graph = body.graph;
  }

  if ("inngest_trigger" in body) {
    update.inngest_trigger = body.inngest_trigger;
  }

  const { data, error } = await supabase
    .from("workflows")
    .update(update)
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ workflow: data });
}

