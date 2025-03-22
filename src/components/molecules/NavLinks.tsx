
import React from "react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";

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
    </>
  );
};

export default NavLinks;
