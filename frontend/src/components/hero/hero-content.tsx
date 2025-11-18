"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Workflows orchestrated",
    value: "12.4M+",
  },
  {
    label: "Average latency",
    value: "< 200ms",
  },
  {
    label: "Integrations",
    value: "60+",
  },
];

export const HeroContent = () => {
  return (
    <div className="relative z-10 flex flex-col items-center gap-8 text-center md:items-start md:text-left">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200"
      >
        <Sparkle className="h-3 w-3" /> Enterprise-grade blockchain orchestration
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        className="text-4xl font-semibold leading-tight text-white md:text-6xl"
      >
        Intercept any on-chain event. Design workflows in minutes.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="max-w-2xl text-base text-slate-300 md:text-lg"
      >
        ChainFlow lets your teams monitor smart contracts, index transactions, and execute trusted
        responses automatically. Power your customer experiences with real-time blockchain
        intelligence backed by Supabase and Inngest.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
        className="flex flex-col items-center gap-3 md:flex-row"
      >
        <Button className="h-12 px-6 text-base" asChild>
          <Link href="#get-started" className="flex items-center gap-2">
            Start building
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" className="h-12 px-6 text-base text-slate-200" asChild>
          <Link href="#demo">Request a demo</Link>
        </Button>
      </motion.div>
      <motion.dl
        className="grid w-full grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/5/40 p-6 backdrop-blur md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dt className="text-sm text-slate-400">{stat.label}</dt>
            <dd className="text-2xl font-semibold text-white">{stat.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
};
