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
    <div className="about-overlay animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-colors z-50"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Large impact text */}
        <h2 className="about-text-large mb-8 md:mb-12">
          GIGIL <span className="about-text-emphasis">IS A WORD</span> THAT MEANS{" "}
          <span className="about-text-emphasis">AN OVERWHELMING</span> URGE TO{" "}
          <span className="about-text-emphasis">SQUEEZE</span> OR{" "}
          <span className="about-text-emphasis">PINCH</span> SOMETHING{" "}
          <span className="about-text-emphasis">UNBEARABLY CUTE</span>
        </h2>

        {/* Subtitle */}
        <p className="about-text-large text-sm md:text-lg mb-12">
          <span className="about-text-emphasis">WE ARE AN</span> INDEPENDENT{" "}
          <span className="about-text-emphasis">CREATIVE AGENCY</span> BASED IN{" "}
          <span className="about-text-emphasis">MANILA</span>
        </p>
      </div>

      {/* Bottom description */}
      <div className="px-6 pb-12 md:pb-16 text-center max-w-2xl mx-auto">
        <p className="text-white/80 text-sm md:text-base leading-relaxed">
          GIGIL POPS is our digital magazine — a collection of stories, campaigns, and creative work 
          that defined the year. Each issue celebrates the culture we create and the impact we make.
        </p>
      </div>
    </div>
  );
};

export default AboutOverlay;
