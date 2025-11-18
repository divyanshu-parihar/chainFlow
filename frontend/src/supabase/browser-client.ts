"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabaseEnv } from "./env";

export const createSupabaseBrowserClient = () =>
  createClient<Database>(supabaseEnv.url, supabaseEnv.anonKey);
