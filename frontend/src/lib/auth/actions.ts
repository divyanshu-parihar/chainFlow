"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/supabase/server-client";
import { isSupabaseConfigured } from "@/supabase/env";

export async function signInWithGoogleAction() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const supabase = await createServerClient();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
      scopes: "openid email profile",
    },
  });

  if (error) {
    console.error("Supabase OAuth error", error);
    throw new Error("Failed to start Google authentication");
  }

  if (!data?.url) {
    throw new Error("Did not receive redirect URL from Supabase");
  }

  redirect(data.url);
}

export async function signOutAction() {
  if (!isSupabaseConfigured) {
    redirect("/");
    return;
  }

  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/");
}