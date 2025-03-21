
import React from "react";

interface FooterProps {
  className?: string;
}

const LayoutFooter: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-muted/30 p-4 border-t ${className}`}>
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Multi-User App. All rights reserved.
      </div>
    </footer>
  );
};

export default LayoutFooter;
