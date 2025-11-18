"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { createSupabaseBrowserClient } from "./browser-client";
import { isSupabaseConfigured } from "./env";

type SupabaseContextValue = {
  supabase: SupabaseClient<Database> | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(
  undefined,
);

export const SupabaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [supabase] = useState<SupabaseClient<Database> | null>(() =>
    isSupabaseConfigured ? createSupabaseBrowserClient() : null,
  );
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({
      supabase,
      session,
      loading,
      configured: isSupabaseConfigured,
    }),
    [loading, session, supabase],
  );

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }

  return context;
};
