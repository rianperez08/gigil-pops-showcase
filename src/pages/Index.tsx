import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarouselSection from "@/components/CarouselSection";
import Lightbox from "@/components/Lightbox";
import AboutOverlay from "@/components/AboutOverlay";

const Index = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPage, setLightboxPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleAboutOpen = useCallback(() => {
    setAboutOpen(true);
  }, []);

  const handleAboutClose = useCallback(() => {
    setAboutOpen(false);
  }, []);

  const handleCtaClick = useCallback(() => {
    const carouselSection = document.getElementById("carousel");
    if (carouselSection) {
      carouselSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleOpenLightbox = useCallback((pageIndex: number) => {
    setLightboxPage(pageIndex);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar onAboutClick={handleAboutOpen} />
      
      <main>
        <HeroSection onCtaClick={handleCtaClick} />
        
        <div ref={carouselRef}>
          <CarouselSection onOpenLightbox={handleOpenLightbox} />
        </div>
      </main>

      {/* Overlays */}
      <Lightbox 
        isOpen={lightboxOpen} 
        pageIndex={lightboxPage} 
        onClose={handleCloseLightbox} 
      />
      
      <AboutOverlay 
        isOpen={aboutOpen} 
        onClose={handleAboutClose} 
      />
    </div>
  );
};

export default Index;
