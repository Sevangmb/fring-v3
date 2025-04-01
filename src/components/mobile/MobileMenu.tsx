
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileUserProfile from "./MobileUserProfile";
import MobileNavItems from "./MobileNavItems";
import MobileMenuFooter from "./MobileMenuFooter";

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

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col flex-1 p-4">
        <MobileUserProfile user={user} />
        <MobileNavItems onClose={onClose} isAdmin={isAdmin} />
      </div>
      
      <MobileMenuFooter onLogout={handleLogout} />
    </div>
  );
};

export default MobileMenu;
