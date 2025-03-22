import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import NavLinks from "../molecules/NavLinks";
import AuthButtons from "../molecules/AuthButtons";
import MobileMenu from "../molecules/MobileMenu";
interface NavbarProps {
  className?: string;
}
const Navbar = ({
  className
}: NavbarProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    user
  } = useAuth();
  const {
    unreadCount,
    refreshUnreadCount
  } = useMessages();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Rafraîchir le compteur de messages non lus
  useEffect(() => {
    if (user) {
      refreshUnreadCount();

      // Rafraîchir le compteur toutes les 30 secondes
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, refreshUnreadCount]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return <header className={cn("fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300", isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent", className)}>
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Fring.app</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLinks unreadCount={unreadCount} user={user} />
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <AuthButtons user={user} />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && <MobileMenu isMenuOpen={isMenuOpen} isScrolled={isScrolled} unreadCount={unreadCount} toggleMenu={toggleMenu} />}
    </header>;
};
export default Navbar;