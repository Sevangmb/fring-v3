
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { Heart, Shield } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface NavLinksProps {
  unreadCount: number;
  user: User | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ unreadCount, user }) => {
  const location = useLocation();
  
  // Vérifiez si l'utilisateur est un administrateur
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mes-vetements", label: "Mes Vêtements" },
    { href: "/mes-favoris", label: "Mes Favoris", icon: <Heart className="h-4 w-4 mr-1" /> },
    { href: "/mes-amis", label: "Mes Amis" },
    { href: "/about", label: "Fring" },
  ];

  // Ajouter le lien d'administration si l'utilisateur est admin
  if (isAdmin) {
    navLinks.push({ 
      href: "/admin", 
      label: "Admin", 
      icon: <Shield className="h-4 w-4 mr-1" /> 
    });
  }

  return (
    <>
      {navLinks.map((link) => (
        <NavItem
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          isActive={location.pathname === link.href}
        />
      ))}
    </>
  );
};

export default NavLinks;
