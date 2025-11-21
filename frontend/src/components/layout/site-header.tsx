"use client";

import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/supabase/provider";
import { toast } from "@/components/ui/sonner";

export function SiteHeader() {
  const { supabase, session, configured } = useSupabase();
  const [pending, setPending] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (!configured || !supabase) {
      toast.error("Supabase is not configured yet. Add env vars to enable auth.");
      return;
    }

    try {
      setPending(true);
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          scopes: "openid email profile",
        },
      });

      if (error) {
        console.error("Supabase OAuth error", error);
        toast.error("Failed to start Google sign-in.");
      }
    } catch (error) {
      console.error("OAuth initiation failed", error);
      toast.error("Unexpected issue starting Google sign-in.");
    } finally {
      setPending(false);
    }
  }, [configured, supabase]);

  const handleSignOut = useCallback(async () => {
    if (!configured || !supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    try {
      setPending(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase sign out error", error);
        toast.error("Failed to sign out.");
      } else {
        toast.success("Signed out");
      }
    } catch (error) {
      console.error("Sign out failed", error);
      toast.error("Unexpected issue during sign out.");
    } finally {
      setPending(false);
    }
  }, [configured, supabase]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/40">
            ⛓️
          </span>
          <span className="text-slate-100">ChainFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {/* <Link href="#features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="#how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="#pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="#faq" className="transition hover:text-white">
            FAQ
          </Link>
          */}
        </nav>
        <div className="flex items-center gap-3">
          {configured ? (
            session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/10 md:flex"
                >
                  Studio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  className="flex items-center gap-2 text-slate-200"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="cursor-pointer group flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-slate-950 shadow-[0_10px_30px_rgba(14,165,233,0.45)] ring-1 ring-cyan-400/60 hover:-translate-y-0.5 hover:shadow-[0_15px_45px_rgba(14,165,233,0.55)]"
                onClick={handleSignIn}
                disabled={pending}
              >
                <span>Sign in with Google</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            )
          ) : (
            <span className="rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400">
              Configure Supabase env vars to enable auth
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
