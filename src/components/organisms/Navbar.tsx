
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import NavItem from "../molecules/NavItem";
import { useIsMobile } from "@/hooks/use-mobile";
import Button from "../atoms/Button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mes-vetements", label: "Mes Vêtements" },
    { href: "/mes-amis", label: "Mes Amis" },
    { href: "/about", label: "About" },
  ];

  // Liens supplémentaires pour les utilisateurs connectés
  const authLinks = user ? [
    { href: "/dashboard", label: "Tableau de bord" },
    { href: "/profile", label: "Profil" },
  ] : [];

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/register");
  const handleProfile = () => navigate("/profile");
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Obtenir les initiales de l'utilisateur pour l'avatar
  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || "";
    if (name) {
      const parts = name.split(/\s+/);
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">AppName</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={location.pathname === link.href}
            />
          ))}
          
          {/* Liens authentifiés pour desktop */}
          {user && authLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={location.pathname === link.href}
            />
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleProfile}
                className="flex items-center gap-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogin}>
                Login
              </Button>
              <Button size="sm" onClick={handleSignUp}>
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full",
            isScrolled ? "pt-16" : "pt-20"
          )}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={location.pathname === link.href}
                  className="px-4 py-3"
                />
              ))}
              
              {/* Liens authentifiés pour mobile */}
              {user && authLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={location.pathname === link.href}
                  className="px-4 py-3"
                />
              ))}
              
              <div className="mt-6 space-y-3">
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center flex items-center gap-2" 
                      onClick={handleProfile}
                    >
                      <User size={18} />
                      Profil
                    </Button>
                    <Button 
                      variant="primary" 
                      className="w-full justify-center text-white bg-red-600 hover:bg-red-700" 
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-center" onClick={handleLogin}>
                      Login
                    </Button>
                    <Button className="w-full justify-center" onClick={handleSignUp}>
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
