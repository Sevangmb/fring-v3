
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { User, Calendar, Shield, Mail, ExternalLink, LogOut, UserRound } from "lucide-react";
import { User as UserType } from "@supabase/supabase-js";
import ProfileAvatar from "./ProfileAvatar";
import Button from "@/components/atoms/Button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface ProfileDetailsProps {
  user: UserType | null;
  getUserInitials: () => string;
  formatJoinDate: () => string;
  avatarUrl?: string | null;
  onLogout: () => Promise<void>;
  onToggleEdit: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  user,
  getUserInitials,
  formatJoinDate,
  avatarUrl,
  onLogout,
  onToggleEdit
}) => {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start gap-8 animate-fade-in">
      <ProfileAvatar
        avatarUrl={avatarUrl}
        userInitials={getUserInitials()}
        isEditing={false}
        isUploading={false}
        onAvatarChange={() => {}}
        onEditClick={onToggleEdit}
      />
      
      <div className="flex-1 text-center md:text-left space-y-6">
        <div>
          <Heading variant="h4" className="mb-1 font-montserrat animate-slide-down bg-gradient-to-r from-primary to-theme-teal-medium bg-clip-text text-transparent">
            {user?.user_metadata?.name || user?.email?.split('@')[0] || "Utilisateur"}
          </Heading>
          <Text variant="subtle" className="mb-6 font-montserrat animate-slide-down">
            {user?.email}
          </Text>
        </div>
        
        <Card className="border border-primary/10 shadow-sm animate-slide-up bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-montserrat flex items-center gap-2">
              <UserRound size={16} className="text-primary" />
              Informations du compte
            </CardTitle>
            <CardDescription className="font-montserrat">
              Détails de votre profil utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <User size={16} className="mt-1 text-muted-foreground" />
                <div>
                  <Text variant="small" className="text-muted-foreground font-montserrat">ID Utilisateur</Text>
                  <Text className="font-medium truncate font-montserrat text-xs">{user?.id}</Text>
                </div>
              </div>
              <div className="flex items-start gap-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <Calendar size={16} className="mt-1 text-muted-foreground" />
                <div>
                  <Text variant="small" className="text-muted-foreground font-montserrat">Inscrit le</Text>
                  <Text className="font-medium font-montserrat">{formatJoinDate()}</Text>
                </div>
              </div>
              <div className="flex items-start gap-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
                <Shield size={16} className="mt-1 text-muted-foreground" />
                <div>
                  <Text variant="small" className="text-muted-foreground font-montserrat">Rôle</Text>
                  <Text className="font-medium font-montserrat capitalize">{user?.role || "Utilisateur"}</Text>
                </div>
              </div>
              <div className="flex items-start gap-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
                <Mail size={16} className="mt-1 text-muted-foreground" />
                <div>
                  <Text variant="small" className="text-muted-foreground font-montserrat">Email vérifié</Text>
                  <Text className="font-medium font-montserrat">
                    {user?.email_confirmed_at ? "Oui" : "Non"}
                  </Text>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up pt-4" style={{ animationDelay: "500ms" }}>
          <Button 
            variant="primary" 
            onClick={onLogout} 
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 font-montserrat"
          >
            <LogOut size={16} />
            Se déconnecter
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onToggleEdit}
            className="w-full md:w-auto flex items-center gap-2 font-montserrat"
          >
            <ExternalLink size={16} />
            Modifier mon profil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
