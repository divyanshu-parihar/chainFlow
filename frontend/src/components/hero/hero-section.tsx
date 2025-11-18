"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroCanvas } from "./hero-canvas";

const stats = [
  {
    icon: Zap,
    label: "Real-time Events",
    value: "Monitor any smart contract event instantly.",
  },
  {
    icon: Database,
    label: "Reliable Storage",
    value: "Workflows & logs securely stored with Supabase.",
  },
  {
    icon: CheckCircle,
    label: "Guaranteed Execution",
    value: "Powered by Inngest for enterprise-grade reliability.",
  },
];

export const HeroSection = () => {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40" id="get-started">
      {/* Canvas background */}
      <HeroCanvas />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm text-primary"
          >
            <span>Powered by Supabase & Inngest</span>
          </motion.div>

          <motion.h1
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            Orchestrate On-Chain Events.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Automate Anything.
            </span>
          </motion.h1>

          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            ChainFlow lets you design, test, and run complex workflows that react
            to blockchain events. No more polling, no more webhooks. Just
            real-time, reliable automation.
          </motion.p>

          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button className="h-12 px-6 text-base" asChild size="lg">
              <Link href="/dashboard" className="flex items-center gap-2">
                Start Building Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-6 text-base"
              asChild
              size="lg"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="mt-12 grid w-full grid-cols-1 gap-8 rounded-2xl border border-border bg-background/50 p-8 backdrop-blur md:grid-cols-3 md:gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"
              >
                <stat.icon className="h-6 w-6 text-primary" />
                <dt className="text-lg font-semibold text-foreground">
                  {stat.label}
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
};