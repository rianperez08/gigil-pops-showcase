import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
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

interface LightboxProps {
  isOpen: boolean;
  pageIndex: number;
  onClose: () => void;
}

const Lightbox = ({ isOpen, pageIndex, onClose }: LightboxProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset on close/open
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
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
  }, [isOpen, onClose]);

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

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="lightbox-backdrop animate-fade-in"
      onClick={handleBackdropClick}
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
          src={pages[pageIndex]}
          alt={`Page ${pageIndex + 1} - Zoomed`}
          className="max-w-full max-h-[90vh] object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Lightbox;
