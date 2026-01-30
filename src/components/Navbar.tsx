import logo from "@/assets/logo.png";

interface NavbarProps {
  onAboutClick: () => void;
}

const Navbar = ({ onAboutClick }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-6">
      {/* Logo */}
      <a href="/" className="block">
        <img 
          src={logo} 
          alt="GIGIL POPS" 
          className="h-10 md:h-14 w-auto object-contain"
        />
      </a>
      
      {/* About Us Button */}
      <button
        onClick={onAboutClick}
        className="text-primary-foreground uppercase tracking-widest text-sm md:text-base font-medium hover:opacity-80 transition-opacity"
      >
        About Us
      </button>
    </nav>
  );
};

export default Navbar;
