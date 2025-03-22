
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/atoms/Typography";
import { Loader2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Edit } from "lucide-react";

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
      <Avatar className="w-24 h-24 text-2xl mb-3 transition-all duration-300 hover:shadow-md">
        {isUploading ? (
          <div className="w-24 h-24 bg-muted flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <AvatarImage 
              src={avatarUrl || ""} 
              alt="Photo de profil" 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-montserrat">
              {userInitials}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      
      {isEditing ? (
        <div className="mt-3 w-full max-w-[250px]">
          <Input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={onAvatarChange}
            className="w-full text-xs font-montserrat"
            disabled={isUploading}
          />
          <Text variant="small" className="text-muted-foreground mt-1 text-center">
            JPG, PNG ou GIF. Max 2MB.
          </Text>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs flex items-center gap-1"
          onClick={onEditClick}
        >
          <Edit size={12} />
          Modifier
        </Button>
      )}
    </div>
  );
};

export default ProfileAvatar;
