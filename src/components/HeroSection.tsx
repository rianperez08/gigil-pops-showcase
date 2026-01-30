import transparentOverlay from "@/assets/transparent-overlay.gif";
import pg1 from "@/assets/pages/pg1.png";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen w-full bg-primary flex flex-col items-center justify-center overflow-hidden">
      {/* Animated GIF overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${transparentOverlay})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          mixBlendMode: 'overlay',
        }}
      />
      
      {/* Hero Cover Image - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-4 py-24 md:py-32">
        <img 
          src={pg1} 
          alt="January Issue Cover"
          className="max-h-[60vh] md:max-h-[70vh] w-auto object-contain shadow-2xl animate-scale-in"
        />
      </div>
      
      {/* CTA Button */}
      <div className="relative z-10 pb-12 md:pb-16">
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
