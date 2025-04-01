
import React from "react";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";

interface MobileUserProfileProps {
  user: User | null;
}

const MobileUserProfile: React.FC<MobileUserProfileProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center justify-center p-4 mb-4">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold mb-2">
          {user.email?.[0]?.toUpperCase() || "U"}
        </div>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
    </div>
  );
};

export default MobileUserProfile;
