
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import NavItem from "./NavItem";
import Button from "../atoms/Button";
import NavLinks from "./NavLinks";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isMenuOpen: boolean;
  isScrolled: boolean;
  unreadCount: number;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isMenuOpen, 
  isScrolled, 
  unreadCount,
  toggleMenu 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/register");
  const handleProfile = () => navigate("/profile");
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "translate-x-full",
        isScrolled ? "pt-16" : "pt-20"
      )}
    >
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-col space-y-4">
          <NavLinks unreadCount={unreadCount} user={user} />
          
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
  );
};

export default MobileMenu;
