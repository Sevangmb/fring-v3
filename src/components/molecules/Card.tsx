
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "outline" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}: CardProps) => {
  const baseStyles = "rounded-lg transition-all duration-300";
  
  const variantStyles = {
    default: "bg-card text-card-foreground shadow-sm",
    glass: "glass shadow-sm",
    outline: "border border-border bg-transparent",
    filled: "bg-secondary text-secondary-foreground",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  const interactiveStyles = cn(
    hoverable && "hover:shadow-md hover:translate-y-[-2px]",
    clickable && "cursor-pointer"
  );

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        interactiveStyles,
        className
      )}
      onClick={clickable ? onClick : undefined}
      role={clickable ? "button" : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-xl font-semibold", className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)} {...props}>
      {children}
    </p>
  );
};

export const CardFooter = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mt-6 flex items-center pt-3", className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
