
import React from "react";
import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "small" | "subtle" | "lead";
  weight?: "light" | "regular" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right";
  color?: string;
}

export const Text = ({
  children,
  className,
  as: Component = "p",
  variant = "p",
  weight = "regular",
  align = "left",
  color,
  ...props
}: TextProps) => {
  const baseStyles = "tracking-tight transition-colors duration-200";
  
  const variantStyles = {
    h1: "text-4xl sm:text-5xl lg:text-6xl",
    h2: "text-3xl sm:text-4xl lg:text-5xl",
    h3: "text-2xl sm:text-3xl",
    h4: "text-xl sm:text-2xl",
    h5: "text-lg sm:text-xl",
    h6: "text-base sm:text-lg font-medium",
    p: "text-base",
    small: "text-sm",
    subtle: "text-sm text-muted-foreground",
    lead: "text-xl",
  };

  const weightStyles = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const alignStyles = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <Component
      className={cn(
        baseStyles,
        variantStyles[variant],
        weightStyles[weight],
        alignStyles[align],
        color,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Heading = (props: TextProps) => {
  const { variant = "h2", as } = props;
  const Component = as || variant;
  
  return <Text as={Component} variant={variant} weight="bold" {...props} />;
};

export default Text;
