import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const sirvBaseUrl = "https://gigilpops.sirv.com/iloveimg-compressed";
const pages = Array.from({ length: 17 }, (_, index) => {
  const pageNumber = index + 1;
  return `${sirvBaseUrl}/pg${pageNumber}.png`;
});

interface LightboxProps {
  isOpen: boolean;
  pageIndex: number;
  onNavigate: (pageIndex: number) => void;
  onClose: () => void;
}

const Lightbox = ({ isOpen, pageIndex, onNavigate, onClose }: LightboxProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset on close/open or page change
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, pageIndex]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowRight") {
        onNavigate((pageIndex + 1) % pages.length);
      }
      if (e.key === "ArrowLeft") {
        onNavigate((pageIndex - 1 + pages.length) % pages.length);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, onNavigate, pageIndex]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.5, Math.min(4, prev + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
      return;
    }

    if (scale === 1 && e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsDragging(false);
    if (scale !== 1) {
      return;
    }

    const { x: startX, y: startY, time } = touchStartRef.current;
    if (!time) {
      return;
    }

    const endTouch = e.changedTouches[0];
    if (!endTouch) {
      return;
    }

    const deltaX = endTouch.clientX - startX;
    const deltaY = endTouch.clientY - startY;
    const duration = Date.now() - time;
    const isSwipe = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) && duration < 600;

    if (isSwipe) {
      const nextIndex = deltaX < 0
        ? (pageIndex + 1) % pages.length
        : (pageIndex - 1 + pages.length) % pages.length;
      onNavigate(nextIndex);
    }

    touchStartRef.current = { x: 0, y: 0, time: 0 };
  }, [scale, pageIndex, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((pageIndex + 1) % pages.length);
  }, [onNavigate, pageIndex]);

  const handlePrev = useCallback(() => {
    onNavigate((pageIndex - 1 + pages.length) % pages.length);
  }, [onNavigate, pageIndex]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 animate-fade-in"
      style={{ backdropFilter: 'blur(8px)' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <button
          onClick={handleZoomIn}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleReset}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors ml-2"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="fixed left-4 right-4 flex items-center justify-between z-50">
        <button
          onClick={handlePrev}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <span className="text-white text-2xl leading-none">‹</span>
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next image"
        >
          <span className="text-white text-2xl leading-none">›</span>
        </button>
      </div>

      {/* Image */}
      <div
        className="max-w-[90vw] max-h-[90vh] overflow-hidden"
        style={{
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          className="Sirv max-w-full max-h-[90vh] object-contain select-none"
          data-src={pages[pageIndex]}
          alt={`Page ${pageIndex + 1} - Zoomed`}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          draggable={false}
        />
      </div>

      {scale === 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-3 py-1 rounded-full">
          Swipe to navigate
        </div>
      )}
    </div>
  );
};

export default Lightbox;
