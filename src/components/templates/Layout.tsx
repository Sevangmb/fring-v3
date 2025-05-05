
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import MainNavigation from "./MainNavigation";
import LayoutFooter from "../organisms/LayoutFooter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: boolean;
}

const Layout = ({
  children,
  className,
  header,
  footer = true,
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  
  // Appliquer une classe au body pour le dark mode (utile pour certains composants)
  useEffect(() => {
    document.body.classList.toggle('dark-theme', resolvedTheme === 'dark');
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [resolvedTheme]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {header || <MainNavigation />}
      <main 
        className={cn(
          "flex-grow",
          isMobile ? "pt-16" : "pt-20 sm:pt-24", // Ajustement du padding-top pour mobile
          className
        )}
      >
        {children}
      </main>
      {footer && <LayoutFooter />}
    </div>
  );
};

export default Layout;
