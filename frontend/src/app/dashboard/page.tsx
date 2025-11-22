import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WorkflowStudio } from "@/components/dashboard/workflow-studio";
import { buildHelloWorldSeed, withParsedGraph } from "@/lib/workflows";
import { isSupabaseConfigured } from "@/supabase/env";
import { createServerClient } from "@/supabase/server-client";
import { createSupabaseBrowserClient } from "@/supabase/browser-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
          <p className="rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
            Missing configuration
          </p>
          <h1 className="mt-6 text-3xl font-semibold">
            Add Supabase credentials to enable the studio
          </h1>
          <p className="mt-4 text-slate-400">
            Populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY,
            then reload this page to unlock the workflow dashboard.
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();


  if (!isSupabaseConfigured) {
    return <div>Missing configuration</div>;
  }
  if (!session) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch workflows", error);
  }

  let hydrated = (data ?? []).map(withParsedGraph);

  if (!hydrated.length) {
    const { data: seeded, error: seedError } = await supabase
      .from("workflows")
      .insert(buildHelloWorldSeed(session.user.id))
      .select("*")
      .single();

    if (seedError) {
      console.error("Failed to seed hello world workflow", seedError);
    } else if (seeded) {
      hydrated = [withParsedGraph(seeded)];
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10 space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/70">
            Studio
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Visual workflow builder
          </h1>
          <p className="text-slate-400">
            Design n8n-style flows, save them in Supabase, and dispatch the Go
            hello-world workflow directly from your dashboard.
          </p>
        </div>
        <WorkflowStudio workflows={hydrated} />
      </main>
      <SiteFooter />
    </div>
  );
}

