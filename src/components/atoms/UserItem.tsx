
import React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/services/userService";

interface UserItemProps {
  user: User;
  isSending: boolean;
  isSuggestion?: boolean;
  onAddFriend: (userId: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  isSending,
  isSuggestion = false,
  onAddFriend
}) => {
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-md border"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {user.email.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.email}</p>
          {isSuggestion && (
            <p className="text-xs text-muted-foreground">Suggestion</p>
          )}
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => onAddFriend(user.id)}
        disabled={isSending}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        {isSending ? "Envoi..." : "Ajouter"}
      </Button>
    </div>
  );
};

export default UserItem;
