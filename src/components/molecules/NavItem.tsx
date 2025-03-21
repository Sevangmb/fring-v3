
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const NavItem = ({ 
  href, 
  label, 
  icon, 
  isActive = false, 
  className,
  onClick 
}: NavItemProps) => {
  const baseStyles = "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200";
  
  const defaultStyles = cn(
    baseStyles,
    "text-foreground/70 hover:text-foreground hover:bg-accent"
  );
  
  const activeStyles = cn(
    baseStyles,
    "text-primary bg-accent"
  );
  
  return (
    <Link
      to={href}
      className={cn(
        isActive ? activeStyles : defaultStyles,
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {label}
    </Link>
  );
};

export default NavItem;
