import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Dubai_skyline_hero_image_312756fe.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNextSection = () => {
    const nextSection = sectionRef.current?.nextElementSibling;
    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Dubai luxury skyline"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 text-center max-w-5xl mx-auto pt-24 sm:pt-28 pb-20 sm:pb-24">
        <div className="animate-in fade-in slide-in-from-right-4 duration-1000 fill-mode-both">
          <p className="mb-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
            Ksenza Hayat Properties
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-light text-white mb-4 sm:mb-5 tracking-wide leading-snug">
            Experience Luxury Living
            <br />
            <span className="font-semibold">in Dubai</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-2">
            Discover extraordinary elegance and luxury with Ksenza Hayat Properties' exclusive collection
            of high-end properties in Dubai's most recognised neighbourhoods.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 shadow-lg"
            data-testid="button-explore-properties"
            onClick={() => setLocation("/properties")}
          >
            <Search className="mr-2 h-5 w-5" />
            Explore Properties
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
            data-testid="button-schedule-consultation"
            onClick={() => setLocation("/contact")}
          >
            Schedule Consultation
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
        data-testid="button-hero-scroll-down"
        className="absolute bottom-10 sm:bottom-12 left-1/2 z-20 -translate-x-1/2 animate-bounce hidden sm:flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Explore</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm hover:bg-white/20">
          <ChevronDown className="h-5 w-5" />
        </span>
      </button>
    </section>
  );
}
