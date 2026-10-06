import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Property } from "@shared/schema";
import PropertyCard from "@/components/PropertyCard";
import { getImageUrl } from "@/lib/imageMap";

interface FeaturedPropertiesCarouselProps {
  properties: Property[];
}

const PROPERTIES_PER_PAGE = 3;
const SLIDE_PAUSE_MS = 4000;
const SLIDE_TRANSITION_MS = 1500;
const AUTO_SLIDE_INTERVAL_MS = SLIDE_PAUSE_MS + SLIDE_TRANSITION_MS;

function getCircularWindows(
  properties: Property[],
  windowSize: number,
  step: number,
): Property[][] {
  const total = properties.length;
  if (total === 0) return [];
  if (total <= windowSize) return [properties];

  const pages: Property[][] = [];
  let start = 0;

  do {
    const page: Property[] = [];
    for (let i = 0; i < windowSize; i++) {
      page.push(properties[(start + i) % total]);
    }
    pages.push(page);
    start = (start + step) % total;
  } while (start !== 0);

  return pages;
}

export default function FeaturedPropertiesCarousel({
  properties,
}: FeaturedPropertiesCarouselProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const [shouldAutoSlide, setShouldAutoSlide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(
    () => getCircularWindows(properties, PROPERTIES_PER_PAGE, PROPERTIES_PER_PAGE),
    [properties],
  );

  const slidePages = useMemo(() => {
    if (pages.length <= 1) return pages;
    return [...pages, pages[0]];
  }, [pages]);

  const activeDot =
    pages.length > 1 && slideIndex === pages.length ? 0 : slideIndex;

  const goToNextSlide = useCallback(() => {
    if (pages.length <= 1) return;
    setEnableTransition(true);
    setSlideIndex((prev) => prev + 1);
  }, [pages.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShouldAutoSlide(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSlideIndex(0);
    setEnableTransition(true);
  }, [properties.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || pages.length <= 1) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      if (slideIndex !== pages.length) return;

      setEnableTransition(false);
      setSlideIndex(0);
    };

    track.addEventListener("transitionend", handleTransitionEnd);
    return () => track.removeEventListener("transitionend", handleTransitionEnd);
  }, [slideIndex, pages.length]);

  useEffect(() => {
    if (enableTransition || slideIndex !== 0) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnableTransition(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [enableTransition, slideIndex]);

  useEffect(() => {
    if (!shouldAutoSlide || pages.length <= 1) return;

    const interval = setInterval(goToNextSlide, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [shouldAutoSlide, pages.length, goToNextSlide]);

  const handleDotClick = (index: number) => {
    if (index === activeDot) return;

    if (index > activeDot) {
      setEnableTransition(true);
      setSlideIndex(index);
      return;
    }

    setEnableTransition(false);
    setSlideIndex(index);
    requestAnimationFrame(() => setEnableTransition(true));
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="mb-12">
      <div className="overflow-hidden py-3 -my-3">
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{
            transform: `translateX(-${slideIndex * 100}%)`,
            transition: enableTransition
              ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`
              : "none",
          }}
        >
          {slidePages.map((page, pageIndex) => (
            <div
              key={`page-${pageIndex}`}
              className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-1"
            >
              {page.map((property) => (
                <PropertyCard
                  key={`${pageIndex}-${property.id}`}
                  property={property}
                  image={getImageUrl(property.images[0])}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to properties page ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDot === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
