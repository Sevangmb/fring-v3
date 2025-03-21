
import React from "react";
import { cn } from "@/lib/utils";
import MainNavigation from "./MainNavigation";
import LayoutFooter from "../organisms/LayoutFooter";

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
  return (
    <div className="flex flex-col min-h-screen">
      {header || <MainNavigation />}
      <main 
        className={cn(
          "flex-grow", 
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
