"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabaseEnv } from "./env";

export const createSupabaseBrowserClient = () =>
  createBrowserClient<Database>(supabaseEnv.url, supabaseEnv.anonKey);