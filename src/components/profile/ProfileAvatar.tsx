
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/atoms/Typography";
import { Loader2, Camera, User } from "lucide-react";
import Button from "@/components/atoms/Button";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  userInitials: string;
  isEditing: boolean;
  isUploading: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  avatarUrl,
  userInitials,
  isEditing,
  isUploading,
  onAvatarChange,
  onEditClick
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <Avatar className="w-28 h-28 text-2xl mb-4 shadow-md transition-all duration-300 hover:shadow-lg border-2 border-white/30">
          {isUploading ? (
            <div className="w-28 h-28 bg-muted flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <AvatarImage 
                src={avatarUrl || ""} 
                alt="Photo de profil" 
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-theme-teal-medium text-primary-foreground font-montserrat">
                {userInitials}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        
        {!isEditing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-full transition-opacity duration-300">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white h-full w-full rounded-full"
              onClick={onEditClick}
            >
              <Camera size={20} className="opacity-80" />
            </Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-3 w-full max-w-[250px]">
          <div className="relative">
            <Input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={onAvatarChange}
              className="w-full text-xs font-montserrat bg-muted/50 px-3 py-2 rounded-md cursor-pointer"
              disabled={isUploading}
            />
            <label htmlFor="avatar" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          </div>
          <Text variant="small" className="text-muted-foreground mt-1 text-center">
            JPG, PNG ou GIF. Max 2MB.
          </Text>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs flex items-center gap-1 font-montserrat"
          onClick={onEditClick}
        >
          <Camera size={12} />
          Modifier
        </Button>
      )}
    </div>
  );
};

export default ProfileAvatar;
