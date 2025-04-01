
import React from "react";
import { cn } from "@/lib/utils";
import MainNavigation from "./MainNavigation";
import LayoutFooter from "../organisms/LayoutFooter";
import { useIsMobile } from "@/hooks/use-mobile";

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
