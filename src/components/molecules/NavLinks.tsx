
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { Heart } from "lucide-react";

interface NavLinksProps {
  unreadCount: number;
  user: any;
}

const NavLinks: React.FC<NavLinksProps> = ({ unreadCount, user }) => {
  const location = useLocation();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/mes-vetements", label: "Mes Vêtements" },
    { href: "/mes-favoris", label: "Mes Favoris", icon: <Heart className="h-4 w-4 mr-1" /> },
    { href: "/mes-amis", label: "Mes Amis" },
    { href: "/about", label: "Fring" },
  ];

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
