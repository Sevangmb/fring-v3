
import React from "react";
import { Search } from "lucide-react";
import { User } from "@/services/userService";
import UserItem from "@/components/atoms/UserItem";

interface UserSearchResultsProps {
  searchTerm: string;
  searchResults: User[];
  isSearching: boolean;
  sendingRequest: Record<string, boolean>;
  onAddFriend: (userId: string) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({
  searchTerm,
  searchResults,
  isSearching,
  sendingRequest,
  onAddFriend
}) => {
  if (!searchTerm) return null;
  
  if (isSearching) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>Recherche en cours...</p>
      </div>
    );
  }
  
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground border rounded-md">
        <p>Aucun utilisateur trouvé pour "{searchTerm}"</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 mb-4">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Search className="h-4 w-4 mr-1 text-muted-foreground" />
        Résultats de recherche
      </h3>
      {searchResults.map(user => (
        <UserItem 
          key={user.id}
          user={user}
          isSending={sendingRequest[user.id] || false}
          onAddFriend={onAddFriend}
        />
      ))}
    </div>
  );
};

export default UserSearchResults;
