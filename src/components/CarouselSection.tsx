import { useState, useEffect, useRef, useCallback } from "react";
// Full resolution images (for Lightbox)
import pg1 from "@/assets/pages/pg1.png";
import pg2 from "@/assets/pages/pg2.png";
import pg3 from "@/assets/pages/pg3.png";
import pg4 from "@/assets/pages/pg4.png";
import pg5 from "@/assets/pages/pg5.png";
import pg6 from "@/assets/pages/pg6.png";
import pg7 from "@/assets/pages/pg7.png";
import pg8 from "@/assets/pages/pg8.png";
import pg9 from "@/assets/pages/pg9.png";
import pg10 from "@/assets/pages/pg10.png";
import pg11 from "@/assets/pages/pg11.png";
import pg12 from "@/assets/pages/pg12.png";
import pg13 from "@/assets/pages/pg13.png";
import pg14 from "@/assets/pages/pg14.png";
import pg15 from "@/assets/pages/pg15.png";
import pg16 from "@/assets/pages/pg16.png";
import pg17 from "@/assets/pages/pg17.png";

// Compressed images (for Carousel)
import pg1Compressed from "@/assets/pages-compressed/pg2.jpg";
import pg2Compressed from "@/assets/pages-compressed/pg3.jpg";
import pg3Compressed from "@/assets/pages-compressed/pg4.jpg";
import pg4Compressed from "@/assets/pages-compressed/pg5.jpg";
import pg5Compressed from "@/assets/pages-compressed/pg6.jpg";
import pg6Compressed from "@/assets/pages-compressed/pg7.jpg";
import pg7Compressed from "@/assets/pages-compressed/pg8.jpg";
import pg8Compressed from "@/assets/pages-compressed/pg9.jpg";
import pg9Compressed from "@/assets/pages-compressed/pg10.jpg";
import pg10Compressed from "@/assets/pages-compressed/pg11.jpg";
import pg11Compressed from "@/assets/pages-compressed/pg12.jpg";
import pg12Compressed from "@/assets/pages-compressed/pg13.jpg";
import pg13Compressed from "@/assets/pages-compressed/pg14.jpg";
import pg14Compressed from "@/assets/pages-compressed/pg15.jpg";
import pg15Compressed from "@/assets/pages-compressed/pg16.jpg";
import pg16Compressed from "@/assets/pages-compressed/pg17.jpg";
import pg17Compressed from "@/assets/pages-compressed/pg18.jpg";

const carouselPages = [
  { src: pg1, full: pg1 },
  { src: pg2Compressed, full: pg2 },
  { src: pg3Compressed, full: pg3 },
  { src: pg4Compressed, full: pg4 },
  { src: pg5Compressed, full: pg5 },
  { src: pg6Compressed, full: pg6 },
  { src: pg7Compressed, full: pg7 },
  { src: pg8Compressed, full: pg8 },
  { src: pg9Compressed, full: pg9 },
  { src: pg10Compressed, full: pg10 },
  { src: pg11Compressed, full: pg11 },
  { src: pg12Compressed, full: pg12 },
  { src: pg13Compressed, full: pg13 },
  { src: pg14Compressed, full: pg14 },
  { src: pg15Compressed, full: pg15 },
  { src: pg16Compressed, full: pg16 },
  { src: pg17Compressed, full: pg17 },
];

interface CarouselSectionProps {
  onOpenLightbox: (pageIndex: number) => void;
}

const CarouselSection = ({ onOpenLightbox }: CarouselSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [mobileIndicator, setMobileIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mobileIndicatorTimeout = useRef<NodeJS.Timeout>();
  const loadingTimeout = useRef<NodeJS.Timeout>();
  const loadedPages = useRef<Set<number>>(new Set([0]));
  const animationDuration = 400;

  const preloadImage = useCallback(async (pageIndex: number) => {
    if (loadedPages.current.has(pageIndex)) return;
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.src = carouselPages[pageIndex].src;
      if ("decode" in img) {
        img
          .decode()
          .then(() => resolve())
          .catch(() => resolve());
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
    loadedPages.current.add(pageIndex);
  }, []);

  // Preload carousel images on mount (compressed versions for speed)
  useEffect(() => {
    carouselPages.forEach(({ src, full }) => {
      const img = new Image();
      img.src = src;
      if (full !== src) {
        const fullImage = new Image();
        fullImage.src = full;
      }
    });
  }, []);

  useEffect(() => {
    const nextIndex = (currentPage + 1) % carouselPages.length;
    const prevIndex = (currentPage - 1 + carouselPages.length) % carouselPages.length;
    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [currentPage, preloadImage]);

  const navigateTo = useCallback(async (direction: "prev" | "next") => {
    if (isAnimating) return;
    const targetPage = direction === "next"
      ? (currentPage + 1) % carouselPages.length
      : (currentPage - 1 + carouselPages.length) % carouselPages.length;

    setIsAnimating(true);

    const shouldPreload = !loadedPages.current.has(targetPage);
    if (shouldPreload) {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      loadingTimeout.current = setTimeout(() => {
        setIsLoading(true);
      }, animationDuration);
      await preloadImage(targetPage);
    }

    setSlideDirection(direction === "next" ? "left" : "right");
    setNextPage(targetPage);

    await new Promise((resolve) => {
      setTimeout(resolve, animationDuration);
    });

    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
    if (shouldPreload) {
      loadedPages.current.add(targetPage);
    }
    setIsLoading(false);
    setCurrentPage(targetPage);
    setNextPage(null);
    setSlideDirection(null);
    setIsAnimating(false);
  }, [animationDuration, currentPage, isAnimating]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (isAnimating) return;
    
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;
    
    const sectionRect = section.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Check if click is within image bounds
    const isWithinImage = 
      clickX >= imageRect.left && 
      clickX <= imageRect.right && 
      clickY >= imageRect.top && 
      clickY <= imageRect.bottom;
    
    if (isWithinImage) {
      const relativeX = (clickX - imageRect.left) / imageRect.width;
      
      // Center band check (30% - 70%) - open lightbox
      if (relativeX >= 0.3 && relativeX <= 0.7) {
        onOpenLightbox(currentPage);
        return;
      }
    }
    
    // Determine left or right half of section for navigation
    const sectionMidX = sectionRect.left + sectionRect.width / 2;
    
    if (clickX < sectionMidX) {
      navigateTo("prev");
    } else {
      navigateTo("next");
    }
  }, [currentPage, isAnimating, navigateTo, onOpenLightbox]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowCursor(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowCursor(false);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setMobileIndicator(true);
    
    if (mobileIndicatorTimeout.current) {
      clearTimeout(mobileIndicatorTimeout.current);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const moveX = e.touches[0].clientX - touchStartX.current;
    const moveY = e.touches[0].clientY - touchStartY.current;

    if (Math.abs(moveX) > Math.abs(moveY)) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateTo("next");
      } else {
        navigateTo("prev");
      }
    }
    
    mobileIndicatorTimeout.current = setTimeout(() => {
      setMobileIndicator(false);
    }, 1000);
  }, [navigateTo]);

  // Calculate animation class
  const getExitAnimationClass = () => {
    if (!slideDirection) return "";
    return slideDirection === "left" ? "page-exit-left" : "page-exit-right";
  };

  const getEnterAnimationClass = () => {
    if (!slideDirection) return "";
    return slideDirection === "left" ? "page-enter-right" : "page-enter-left";
  };

  return (
    <section 
      ref={sectionRef}
      id="carousel"
      className="relative min-h-screen w-full flex items-center justify-center py-16 md:py-24 cursor-pointer touch-pan-y"
      onClick={handleClick}
      style={{ background: '#000' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cursor indicator - desktop only */}
      {showCursor && (
        <div
          className="hidden md:block fixed pointer-events-none text-white font-bold text-sm px-3 py-1.5 rounded-full z-50 bg-black/50"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {currentPage + 1} / {carouselPages.length}
        </div>
      )}
      
      {/* Mobile indicator */}
      {mobileIndicator && (
        <div className="md:hidden absolute top-4 right-4 bg-white/90 text-black font-bold text-sm px-3 py-1.5 rounded-full z-20">
          {currentPage + 1} / {carouselPages.length}
        </div>
      )}
      
      {/* Spread container */}
      <div 
        className="relative z-10 bg-white/95 shadow-2xl rounded-sm overflow-hidden"
        style={{
          maxWidth: '980px',
          width: '72vw',
        }}
      >
        <img
          src={carouselPages[currentPage].src}
          srcSet={`${carouselPages[currentPage].src} 1x`}
          alt=""
          aria-hidden="true"
          className="w-full h-auto opacity-0 pointer-events-none select-none"
          draggable={false}
        />
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src={carouselPages[currentPage].src}
            srcSet={`${carouselPages[currentPage].src} 1x`}
            alt={`Page ${currentPage + 1}`}
            className={`absolute inset-0 w-full h-full object-contain ${getExitAnimationClass()}`}
            draggable={false}
          />
          {nextPage !== null && (
            <img
              src={carouselPages[nextPage].src}
              srcSet={`${carouselPages[nextPage].src} 1x`}
              alt={`Page ${nextPage + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${isLoading ? "opacity-80" : "opacity-100"} ${getEnterAnimationClass()}`}
              draggable={false}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
