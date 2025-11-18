import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/hero/hero-section";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
      <SiteFooter />
    </div>
  );
}
