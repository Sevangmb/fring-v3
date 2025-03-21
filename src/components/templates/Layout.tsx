
import React from "react";
import { cn } from "@/lib/utils";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

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
      {header || <Navbar />}
      <main 
        className={cn(
          "flex-grow", 
          className
        )}
      >
        {children}
      </main>
      {footer && <Footer />}
    </div>
  );
};

export default Layout;
