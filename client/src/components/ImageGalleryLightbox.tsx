import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { getImageUrl } from "@/lib/imageMap";

interface ImageGalleryLightboxProps {
  images: string[];
  currentIndex?: number;
}

export default function ImageGalleryLightbox({
  images,
  currentIndex = 0,
}: ImageGalleryLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {/* Main/Featured Image */}
        <div className="col-span-4 md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden">
          <img
            src={getImageUrl(images[0])}
            alt="Featured property view"
            className="w-full h-full object-cover aspect-[4/3] md:aspect-auto md:h-full transition-transform duration-300 group-hover:scale-105"
            onClick={() => openLightbox(0)}
            data-testid="image-gallery-featured"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              size="icon"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => openLightbox(0)}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index + 1}
            className="relative group cursor-pointer overflow-hidden aspect-[4/3]"
          >
            <img
              src={getImageUrl(image)}
              alt={`Property view ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={() => openLightbox(index + 1)}
              data-testid={`image-gallery-thumb-${index + 1}`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{images.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-7xl w-full h-[90vh] p-0"
          onKeyDown={handleKeyDown}
          data-testid="lightbox-dialog"
        >
          <div className="relative h-full flex items-center justify-center bg-black">
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-4 z-50 text-white hover:bg-white/20"
                onClick={prevImage}
                data-testid="button-prev-image"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image */}
            <img
              src={getImageUrl(images[activeIndex])}
              alt={`Property view ${activeIndex + 1}`}
              className="max-h-full max-w-full object-contain"
              data-testid={`lightbox-image-${activeIndex}`}
            />

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 z-50 text-white hover:bg-white/20"
                onClick={nextImage}
                data-testid="button-next-image"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {activeIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90%] p-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    index === activeIndex
                      ? "border-primary scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  data-testid={`lightbox-thumb-${index}`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
