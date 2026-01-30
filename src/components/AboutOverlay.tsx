import { useEffect } from "react";
import { X } from "lucide-react";

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay = ({ isOpen, onClose }: AboutOverlayProps) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 overflow-auto animate-fade-in">
      {/* Close X button top-right */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-50"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl w-full py-20">
        {/* Large impact text - GeistMono Medium, justified */}
        <p 
          className="uppercase font-medium leading-[1.25] tracking-tight text-justify"
          style={{ 
            fontFamily: "'GeistMono', monospace",
            fontSize: 'clamp(1rem, 3.5vw, 2.5rem)',
            color: '#ed008c'
          }}
        >
          <span className="text-white"><i>GIGIL POPS</i></span> IS GIGIL'S MONTHLY EDITORIAL PUBLICATION AT THE CROSSROADS OF CREATIVITY AND POP CULTURE. EACH ISSUE CURATES THE AGENCY'S BEST WORK, EXPERIMENTS, AND CULTURAL REFLECTIONS INTO A MODERN MAGAZINE FORMAT DESIGNED TO SPARK CONVERSATION, MAKE NOISE, AND CELEBRATE IDEAS THAT POP.
        </p>
      </div>

      {/* Bottom description */}
      <div className="pb-12 md:pb-16 text-center max-w-3xl mx-auto">
        <p className="text-white/90 text-xs md:text-sm leading-relaxed tracking-wide">
          Gigil POPS will be released at the end of each month, serving as a monthly recap that captures the highlights, stories, and creative energy of everything that happened within that month, and more.
        </p>
      </div>

      {/* Click anywhere to close */}
      <div 
        className="absolute inset-0 z-[-1]" 
        onClick={onClose}
      />
    </div>
  );
};

export default AboutOverlay;
