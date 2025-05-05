
import React, { forwardRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import MobileNavItems from "./MobileNavItems";
import MobileUserProfile from "./MobileUserProfile";
import MobileMenuFooter from "./MobileMenuFooter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose }, ref) => {
    const { user } = useAuth();

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header area with profile info if logged in */}
          {user && <MobileUserProfile user={user} />}

          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <MobileNavItems onItemClick={onClose} />
          </div>

          {/* Footer with theme switcher */}
          <MobileMenuFooter />
        </div>
      </div>
    );
  }
);

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
