import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider, useSupabase } from "@/supabase/provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainFlow",
  description:
    "Design blockchain-aware workflows that react to on-chain events and orchestrate downstream automations.",
  metadataBase: new URL("https://chainflow.app"),
  openGraph: {
    title: "ChainFlow | Orchestrate On-Chain Workflows",
    description:
      "Capture blockchain events, design enterprise-grade workflows, and automate smart responses with Inngest.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChainFlow",
    description:
      "Build resilient blockchain automations powered by Supabase and Inngest.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useSupabase();
  console.log("session", session);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <SupabaseProvider>
          <QueryProvider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
