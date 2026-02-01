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
import pg2Compressed from "@/assets/pages-compressed/pg2.png";
import pg3Compressed from "@/assets/pages-compressed/pg3.png";
import pg4Compressed from "@/assets/pages-compressed/pg4.png";
import pg5Compressed from "@/assets/pages-compressed/pg5.png";
import pg6Compressed from "@/assets/pages-compressed/pg6.png";

const carouselPages = [
  { src: pg1, full: pg1 },
  { src: pg2Compressed, full: pg2 },
  { src: pg3Compressed, full: pg3 },
  { src: pg4Compressed, full: pg4 },
  { src: pg5Compressed, full: pg5 },
  { src: pg6Compressed, full: pg6 },
  { src: pg7, full: pg7 },
  { src: pg8, full: pg8 },
  { src: pg9, full: pg9 },
  { src: pg10, full: pg10 },
  { src: pg11, full: pg11 },
  { src: pg12, full: pg12 },
  { src: pg13, full: pg13 },
  { src: pg14, full: pg14 },
  { src: pg15, full: pg15 },
  { src: pg16, full: pg16 },
  { src: pg17, full: pg17 },
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
  
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mobileIndicatorTimeout = useRef<NodeJS.Timeout>();
  const animationDuration = 400;

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

  const navigateTo = useCallback((direction: "prev" | "next") => {
    if (isAnimating) return;
    const targetPage = direction === "next"
      ? (currentPage + 1) % carouselPages.length
      : (currentPage - 1 + carouselPages.length) % carouselPages.length;

    setIsAnimating(true);
    setSlideDirection(direction === "next" ? "left" : "right");
    setNextPage(targetPage);

    setTimeout(() => {
      setCurrentPage(targetPage);
      setNextPage(null);
      setSlideDirection(null);
      setIsAnimating(false);
    }, animationDuration);
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
          srcSet={`${carouselPages[currentPage].src} 1x, ${carouselPages[currentPage].full} 2x`}
          alt=""
          aria-hidden="true"
          className="w-full h-auto opacity-0 pointer-events-none select-none"
          draggable={false}
        />
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            src={carouselPages[currentPage].src}
            srcSet={`${carouselPages[currentPage].src} 1x, ${carouselPages[currentPage].full} 2x`}
            alt={`Page ${currentPage + 1}`}
            className={`absolute inset-0 w-full h-full object-contain ${getExitAnimationClass()}`}
            draggable={false}
          />
          {nextPage !== null && (
            <img
              src={carouselPages[nextPage].src}
              srcSet={`${carouselPages[nextPage].src} 1x, ${carouselPages[nextPage].full} 2x`}
              alt={`Page ${nextPage + 1}`}
              className={`absolute inset-0 w-full h-full object-contain ${getEnterAnimationClass()}`}
              draggable={false}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
