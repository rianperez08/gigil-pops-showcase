import { useState, useEffect, useRef, useCallback } from "react";
import pg1 from "@/assets/pages/pg1.png";
import pg2 from "@/assets/pages/pg2.png";
import pg3 from "@/assets/pages/pg3.png";
import pg4 from "@/assets/pages/pg4.png";
import pg5 from "@/assets/pages/pg5.png";
import pg6 from "@/assets/pages/pg6.png";
import pg7 from "@/assets/pages/pg7.png";
import pg8 from "@/assets/pages/pg8.png";
import transparentOverlay from "@/assets/transparent-overlay.gif";
const pages = [pg1, pg2, pg3, pg4, pg5, pg6, pg7, pg8];

interface CarouselSectionProps {
  onOpenLightbox: (pageIndex: number) => void;
}

const CarouselSection = ({ onOpenLightbox }: CarouselSectionProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [displayPage, setDisplayPage] = useState(currentPage);
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

  const navigateTo = useCallback((direction: "prev" | "next") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Calculate new page immediately
    const newPage = direction === "next" 
      ? (currentPage + 1) % pages.length 
      : (currentPage - 1 + pages.length) % pages.length;
    
    // Update displayPage immediately for indicator
    setDisplayPage(newPage);
    
    // Set animation class
    setAnimationClass(direction === "next" ? "page-enter-right" : "page-enter-left");
    
    // Update actual page state
    setCurrentPage(newPage);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimationClass("");
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
        // Open lightbox for center click
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
    const section = sectionRef.current;
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    
    // Calculate cursor position relative to viewport
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
      
      {/* Spread container */}
      <div className="spread-container">
        <div className="relative overflow-hidden ">
          <img
            ref={imageRef}
            src={pages[currentPage]}
            alt={`Page ${currentPage + 1}`}
            className={`w-full h-auto object-contain ${animationClass}`}
            draggable={false}
          />
        </div>
      </div>


      <img
        src={transparentOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        style={{
          opacity: 1,
          mixBlendMode: 'screen',
        }}
      />
    </section>
  );
};

export default CarouselSection;
