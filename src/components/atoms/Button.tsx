
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left",
  asChild = false,
  ...props
}: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-accent",
    ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-accent",
    link: "text-primary underline-offset-4 hover:underline focus:ring-primary",
  };

  const sizeStyles = {
    sm: "text-xs px-3 h-8",
    md: "text-sm px-4 h-10",
    lg: "text-base px-6 h-12",
  };

  // Button with icon adjustments
  const iconClasses = icon ? (
    iconPosition === "left" 
      ? "inline-flex items-center gap-2" 
      : "inline-flex flex-row-reverse items-center gap-2"
  ) : "";

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        iconClasses,
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && icon}
      {children}
    </Comp>
  );
};

export default Button;
