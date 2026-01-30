import transparentOverlay from "@/assets/transparent-overlay.gif";
import janCover from "@/assets/jan-cover.png";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Base magenta background */}
      <div className="absolute inset-0 bg-primary z-0" />
      
      {/* Animated GIF overlay - ON TOP of magenta, higher opacity for visibility */}
      <img
        src={transparentOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        style={{
          opacity: 0.25,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Hero Cover Image - centered */}
      <div className="relative z-20 flex-1 flex items-center justify-center w-full px-4 py-24 md:py-32">
        <img 
          src={janCover} 
          alt="January Issue Cover"
          className="max-h-[60vh] md:max-h-[75vh] w-auto object-contain shadow-2xl animate-scale-in"
        />
      </div>
      
      {/* CTA Button */}
      <div className="relative z-20 pb-12 md:pb-16">
        <button
          onClick={onCtaClick}
          className="cta-underline text-sm md:text-base px-4 py-2"
        >
          Read the January Issue
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
