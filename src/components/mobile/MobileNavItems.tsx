
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Shirt, Heart, Users, MessageCircle, Shield, LayoutDashboard, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MobileMenuItem from "./MobileMenuItem";

interface MobileNavItemsProps {
  onClose: () => void;
  isAdmin: boolean;
}

const MobileNavItems: React.FC<MobileNavItemsProps> = ({ onClose, isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };
  
  return (
    <div className="grid gap-2">
      <MobileMenuItem
        icon={Home}
        label="Home"
        isActive={location.pathname === "/"}
        onClick={() => handleNavigate("/")}
      />
      
      <MobileMenuItem
        icon={Shirt}
        label="Mes Vêtements"
        isActive={location.pathname.includes("mes-vetements")}
        onClick={() => handleNavigate("/mes-vetements")}
      />
      
      <MobileMenuItem
        icon={Heart}
        label="Mes Favoris"
        isActive={location.pathname.includes("favoris")}
        onClick={() => handleNavigate("/mes-favoris")}
      />
      
      <MobileMenuItem
        icon={Users}
        label="Mes Amis"
        isActive={location.pathname.includes("amis")}
        onClick={() => handleNavigate("/mes-amis")}
      />
      
      <MobileMenuItem
        icon={MessageCircle}
        label="Fring"
        isActive={location.pathname.includes("fring")}
        onClick={() => handleNavigate("/fring")}
      />

      <Separator className="my-2" />

      <MobileMenuItem
        icon={MessageCircle}
        label="Voir Messages"
        isActive={location.pathname.includes("messages")}
        onClick={() => handleNavigate("/messages")}
      />

      <MobileMenuItem
        icon={LayoutDashboard}
        label="Tableau de bord"
        isActive={location.pathname.includes("dashboard")}
        onClick={() => handleNavigate("/dashboard")}
      />

      <MobileMenuItem
        icon={User}
        label="Profil"
        isActive={location.pathname.includes("profile")}
        onClick={() => handleNavigate("/profile")}
      />

      {isAdmin && (
        <MobileMenuItem
          icon={Shield}
          label="Administration"
          variant="admin"
          isActive={location.pathname.includes("admin")}
          onClick={() => handleNavigate("/admin")}
        />
      )}
    </div>
  );
};

export default MobileNavItems;
