import { HeroCanvas } from "./hero-canvas";
import { HeroContent } from "./hero-content";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pb-28 pt-32" id="get-started">
      <div className="absolute inset-0">
        <HeroCanvas />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        <HeroContent />
      </div>
    </section>
  );
};
