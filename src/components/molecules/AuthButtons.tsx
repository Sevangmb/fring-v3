
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";

interface AuthButtonsProps {
  user: any;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ user }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/register");
  const handleProfile = () => navigate("/profile");
  const handleDashboard = () => navigate("/dashboard");
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

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDashboard}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Tableau de bord
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleLogin}>
        Login
      </Button>
      <Button size="sm" onClick={handleSignUp}>
        Sign up
      </Button>
    </>
  );
};

export default AuthButtons;
