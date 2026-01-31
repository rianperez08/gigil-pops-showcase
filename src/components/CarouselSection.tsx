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
import pg10 from "@/assets/pages/pg10.png";
import pg11 from "@/assets/pages/pg11.png";
import pg12 from "@/assets/pages/pg12.png";
import pg13 from "@/assets/pages/pg13.png";
import pg14 from "@/assets/pages/pg14.png";
import pg15 from "@/assets/pages/pg15.png";
import pg16 from "@/assets/pages/pg16.png";
import pg17 from "@/assets/pages/pg17.png";

const pages = [pg1, pg2, pg3, pg4, pg5, pg6, pg7, pg8, pg9, pg10, pg11, pg12, pg13, pg14, pg15, pg16, pg17];

interface CarouselSectionProps {
  onOpenLightbox: (pageIndex: number) => void;
}

const CarouselSection = ({ onOpenLightbox }: CarouselSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [mobileIndicator, setMobileIndicator] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef(0);
  const mobileIndicatorTimeout = useRef<NodeJS.Timeout>();

  // Preload all images on mount
  useEffect(() => {
    pages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const navigateTo = useCallback((direction: "prev" | "next") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction === "next" ? "left" : "right");
    
    // Update page after a brief delay to show animation start
    setTimeout(() => {
      setCurrentPage(prev => {
        if (direction === "next") {
          return (prev + 1) % pages.length;
        } else {
          return (prev - 1 + pages.length) % pages.length;
        }
      });
      
      // Reset animation state
      setTimeout(() => {
        setSlideDirection(null);
        setIsAnimating(false);
      }, 50);
    }, 200);
  }, [isAnimating]);

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
    setMobileIndicator(true);
    
    if (mobileIndicatorTimeout.current) {
      clearTimeout(mobileIndicatorTimeout.current);
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
  const getAnimationClass = () => {
    if (!slideDirection) return "";
    return slideDirection === "left" ? "animate-slide-out-left" : "animate-slide-out-right";
  };

  return (
    <section 
      ref={sectionRef}
      id="carousel"
      className="relative min-h-screen w-full flex items-center justify-center py-16 md:py-24 cursor-pointer"
      onClick={handleClick}
      style={{ background: '#000' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
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
          {currentPage + 1} / {pages.length}
        </div>
      )}
      
      {/* Mobile indicator */}
      {mobileIndicator && (
        <div className="md:hidden absolute top-4 right-4 bg-white/90 text-black font-bold text-sm px-3 py-1.5 rounded-full z-20">
          {currentPage + 1} / {pages.length}
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
          ref={imageRef}
          src={pages[currentPage]}
          alt={`Page ${currentPage + 1}`}
          className={`w-full h-auto object-contain transition-opacity duration-200 ${getAnimationClass()}`}
          style={{
            opacity: slideDirection ? 0.5 : 1,
            transform: slideDirection === "left" 
              ? 'translateX(-20px)' 
              : slideDirection === "right" 
                ? 'translateX(20px)' 
                : 'translateX(0)',
            transition: 'transform 200ms ease-out, opacity 200ms ease-out',
          }}
          draggable={false}
        />
      </div>
    </section>
  );
};

export default CarouselSection;
