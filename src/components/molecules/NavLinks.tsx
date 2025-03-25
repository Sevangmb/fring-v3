
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
      <NavItem href="/" label="Accueil" icon={<Home size={18} />} />

      {user && (
        <>
          <NavItem href="/mes-amis" label="Amis" icon={<Users size={18} />} />
          
          <NavItem href="/messages" label="Messages" icon={<MessageSquare size={18} />} badge={unreadCount} />
          
          <NavItem href="/mes-vetements" label="Vêtements" icon={<ShoppingBag size={18} />} />
          
          <NavItem href="/ensembles/ajouter" label="Ensembles" icon={<ShoppingCart size={18} />} />
          
          <NavItem href="/mes-favoris" label="Favoris" icon={<Star size={18} />} />
          
          {isAdmin && (
            <NavItem href="/admin" label="Admin" icon={<Shield size={18} />} className="text-primary" />
          )}
        </>
      )}
    </>
  );
};

export default NavLinks;
