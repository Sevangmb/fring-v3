
import React from "react";
import { Users } from "lucide-react";
import { User } from "@/services/userService";
import UserItem from "@/components/atoms/UserItem";

interface UserSuggestionsProps {
  suggestedUsers: User[];
  isLoadingSuggestions: boolean;
  sendingRequest: Record<string, boolean>;
  onAddFriend: (userId: string) => void;
}

const UserSuggestions: React.FC<UserSuggestionsProps> = ({
  suggestedUsers,
  isLoadingSuggestions,
  sendingRequest,
  onAddFriend
}) => {
  if (isLoadingSuggestions) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Chargement des suggestions...</p>
      </div>
    );
  }
  
  if (suggestedUsers.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
        Suggestions d'utilisateurs
      </h3>
      {suggestedUsers.map(user => (
        <UserItem 
          key={user.id}
          user={user}
          isSending={sendingRequest[user.id] || false}
          isSuggestion={true}
          onAddFriend={onAddFriend}
        />
      ))}
    </div>
  );
};

export default UserSuggestions;
