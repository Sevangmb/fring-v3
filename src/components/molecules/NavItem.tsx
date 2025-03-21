
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
  badge?: number;
}

const NavItem = ({ 
  href, 
  label, 
  icon, 
  isActive = false, 
  className,
  onClick,
  badge
}: NavItemProps) => {
  const baseStyles = "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 relative";
  
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
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

export default NavItem;
