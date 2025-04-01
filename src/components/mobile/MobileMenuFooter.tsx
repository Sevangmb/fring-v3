
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MobileSocialLinks from "./MobileSocialLinks";

interface MobileMenuFooterProps {
  onLogout: () => void;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({ onLogout }) => {
  return (
    <>
      <div className="p-4 mt-auto">
        <Button 
          variant="destructive" 
          className="w-full h-12"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Déconnexion
        </Button>
      </div>

      <div className="p-4 text-center text-xs text-muted-foreground">
        <MobileSocialLinks />
        <p>© 2025 Fring App. All rights reserved.</p>
      </div>
    </>
  );
};

export default MobileMenuFooter;
