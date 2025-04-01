
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileMenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  variant?: "default" | "ghost" | "admin";
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className,
  variant = "ghost"
}) => {
  let buttonClass = cn(
    "justify-start h-12 px-4 font-normal w-full",
    isActive && variant !== "admin" && "bg-primary/10 text-primary",
    className
  );
  
  if (variant === "admin") {
    buttonClass = cn(
      buttonClass,
      "text-amber-700 dark:text-amber-400"
    );
    
    return (
      <Button
        variant="ghost"
        size="lg"
        className={buttonClass}
        onClick={onClick}
      >
        <Icon className="mr-3 h-5 w-5 text-amber-600 dark:text-amber-400" />
        {label}
      </Button>
    );
  }
  
  return (
    <Button
      variant={variant}
      size="lg"
      className={buttonClass}
      onClick={onClick}
    >
      <Icon className="mr-3 h-5 w-5" />
      {label}
    </Button>
  );
};

export default MobileMenuItem;
