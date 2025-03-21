
import React from "react";
import { cn } from "@/lib/utils";
import MainNavigation from "./MainNavigation";

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
      {footer && (
        <footer className="bg-muted/30 p-4 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Multi-User App. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
