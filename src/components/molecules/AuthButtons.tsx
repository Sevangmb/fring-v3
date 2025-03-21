
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface AuthButtonsProps {
  user: any;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ user }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

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

  if (user) {
    return (
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
