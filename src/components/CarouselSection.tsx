import { useState, useEffect, useRef, useCallback } from "react";
import pg1 from "@/assets/pages/pg1.png";
import pg2 from "@/assets/pages/pg2.png";
import pg3 from "@/assets/pages/pg3.png";
import pg4 from "@/assets/pages/pg4.png";
import pg5 from "@/assets/pages/pg5.png";
import pg6 from "@/assets/pages/pg6.png";
import pg7 from "@/assets/pages/pg7.png";
import pg8 from "@/assets/pages/pg8.png";
import pg9 from "@/assets/pages/pg9.png";

const pages = [pg1, pg2, pg3, pg4, pg5, pg6, pg7, pg8, pg9];

interface CarouselSectionProps {
  onOpenLightbox: (pageIndex: number) => void;
}

const CarouselSection = ({ onOpenLightbox }: CarouselSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [mobileIndicator, setMobileIndicator] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);
  const mobileIndicatorTimeout = useRef<NodeJS.Timeout>();

  // Preload all images
  useEffect(() => {
    pages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const navigateTo = useCallback((dir: "prev" | "next") => {
    if (isAnimating) return;
    
    const newPage = dir === "next" 
      ? (currentPage + 1) % pages.length 
      : (currentPage - 1 + pages.length) % pages.length;
    
    setNextPage(newPage);
    setDirection(dir === "next" ? "left" : "right");
    setIsAnimating(true);
    
    // After animation completes, update current page
    setTimeout(() => {
      setCurrentPage(newPage);
      setNextPage(null);
      setDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [currentPage, isAnimating]);

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
      // Calculate relative position within image
      const relativeX = (clickX - imageRect.left) / imageRect.width;
      
      // Center band check (30% - 70%)
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
    setMobileIndicator(true);
    
    if (mobileIndicatorTimeout.current) {
      clearTimeout(mobileIndicatorTimeout.current);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateTo("next");
      } else {
        navigateTo("prev");
      }
    }
    
    // Hide mobile indicator after delay
    mobileIndicatorTimeout.current = setTimeout(() => {
      setMobileIndicator(false);
    }, 1000);
  }, [navigateTo]);

  // Calculate display page for indicator (shows target during animation)
  const displayPage = nextPage !== null ? nextPage : currentPage;

  return (
    <section 
      ref={sectionRef}
      id="carousel"
      className="relative min-h-screen w-full bg-primary flex items-center justify-center py-16 md:py-24 cursor-pointer"
      onClick={handleClick}
      style={{background:'#000'}}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cursor indicator - desktop only, fixed position */}
      {showCursor && (
        <div
          className="hidden md:block fixed pointer-events-none text-primary-foreground font-bold text-sm px-3 py-1.5 rounded-full z-50"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {displayPage + 1} / {pages.length}
        </div>
      )}
      
      {/* Mobile indicator */}
      {mobileIndicator && (
        <div className="md:hidden absolute top-4 right-4 bg-primary-foreground/90 text-primary font-bold text-sm px-3 py-1.5 rounded-full z-20 animate-fade-in">
          {displayPage + 1} / {pages.length}
        </div>
      )}
      
      {/* Spread container with swipe animation */}
      <div className="spread-container relative z-10">
        <div className="relative overflow-hidden">
          {/* Container for both images during animation */}
          <div 
            className="flex transition-transform duration-400 ease-out"
            style={{
              transform: direction === "left" 
                ? 'translateX(-50%)' 
                : direction === "right" 
                  ? 'translateX(0%)' 
                  : 'translateX(0%)',
              width: nextPage !== null ? '200%' : '100%',
            }}
          >
            {/* Previous/Current image when swiping right */}
            {direction === "right" && nextPage !== null && (
              <img
                src={pages[nextPage]}
                alt={`Page ${nextPage + 1}`}
                className="w-1/2 h-auto object-contain flex-shrink-0"
                draggable={false}
              />
            )}
            
            {/* Current image */}
            <img
              ref={imageRef}
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className={`h-auto object-contain flex-shrink-0 ${nextPage !== null ? 'w-1/2' : 'w-full'}`}
              draggable={false}
            />
            
            {/* Next image when swiping left */}
            {direction === "left" && nextPage !== null && (
              <img
                src={pages[nextPage]}
                alt={`Page ${nextPage + 1}`}
                className="w-1/2 h-auto object-contain flex-shrink-0"
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
