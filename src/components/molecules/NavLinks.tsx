
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { Mail } from "lucide-react";

interface NavLinksProps {
  unreadCount: number;
  user: any;
}

const NavLinks: React.FC<NavLinksProps> = ({ unreadCount, user }) => {
  const location = useLocation();
  
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
    { 
      href: "/messages", 
      label: "Messages", 
      icon: <Mail className="h-4 w-4 mr-2" />,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
  ] : [];

  return (
    <>
      {navLinks.map((link) => (
        <NavItem
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={location.pathname === link.href}
        />
      ))}
      
      {/* Liens authentifiés */}
      {user && authLinks.map((link) => (
        <NavItem
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          isActive={location.pathname.startsWith(link.href)}
          badge={link.badge}
        />
      ))}
    </>
  );
};

export default NavLinks;
