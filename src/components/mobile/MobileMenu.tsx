
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Shirt, 
  Heart, 
  Users, 
  MessageCircle, 
  Shield, 
  LogOut, 
  User,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col flex-1 p-4">
        {user && (
          <div className="flex items-center justify-center p-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold mb-2">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname === "/" && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/")}
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("mes-vetements") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/mes-vetements")}
          >
            <Shirt className="mr-3 h-5 w-5" />
            Mes Vêtements
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("favoris") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/mes-favoris")}
          >
            <Heart className="mr-3 h-5 w-5" />
            Mes Favoris
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("amis") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/mes-amis")}
          >
            <Users className="mr-3 h-5 w-5" />
            Mes Amis
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("fring") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/fring")}
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            Fring
          </Button>

          <Separator className="my-2" />

          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("messages") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/messages")}
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            Voir Messages
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("dashboard") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/dashboard")}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Tableau de bord
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "justify-start h-12 px-4 font-normal",
              location.pathname.includes("profile") && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate("/profile")}
          >
            <User className="mr-3 h-5 w-5" />
            Profil
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              size="lg"
              className="justify-start h-12 px-4 font-normal text-amber-700 dark:text-amber-400"
              onClick={() => handleNavigate("/admin")}
            >
              <Shield className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
              Administration
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <Button 
          variant="destructive" 
          className="w-full h-12"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Déconnexion
        </Button>
      </div>

      <div className="p-4 text-center text-xs text-muted-foreground">
        <div className="flex justify-center space-x-4 mb-2">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
        <p>© 2025 Fring App. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MobileMenu;
