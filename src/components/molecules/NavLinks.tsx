
import React from "react";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";
import { User } from "@supabase/supabase-js";
import { 
  Home, 
  Users, 
  MessageSquare, 
  ShoppingBag,
  ShoppingCart,
  Star,
  Shield
} from "lucide-react";

interface NavLinksProps {
  unreadCount?: number;
  user: User | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ unreadCount = 0, user }) => {
  // Vérifier si l'utilisateur est un administrateur (simplifié pour l'exemple)
  const isAdmin = user?.email === 'admin@fring.app';

  return (
    <>
      <NavItem to="/" icon={<Home size={18} />}>
        Accueil
      </NavItem>

      {user && (
        <>
          <NavItem to="/mes-amis" icon={<Users size={18} />}>
            Amis
          </NavItem>
          
          <NavItem to="/messages" icon={<MessageSquare size={18} />} notificationCount={unreadCount}>
            Messages
          </NavItem>
          
          <NavItem to="/mes-vetements" icon={<ShoppingBag size={18} />}>
            Vêtements
          </NavItem>
          
          <NavItem to="/ensembles/ajouter" icon={<ShoppingCart size={18} />}>
            Ensembles
          </NavItem>
          
          <NavItem to="/mes-favoris" icon={<Star size={18} />}>
            Favoris
          </NavItem>
          
          {isAdmin && (
            <NavItem to="/admin" icon={<Shield size={18} />} className="text-primary">
              Admin
            </NavItem>
          )}
        </>
      )}
    </>
  );
};

export default NavLinks;
