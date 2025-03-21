
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserSearchFormProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
}

const UserSearchForm: React.FC<UserSearchFormProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  isSearching
}) => {
  return (
    <form onSubmit={onSearch} className="flex items-center space-x-2 mt-4">
      <Input
        placeholder="Rechercher par email..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="sm"
        disabled={isSearching || !searchTerm.trim()}
      >
        <Search className="h-4 w-4 mr-1" />
        {isSearching ? "Recherche..." : "Rechercher"}
      </Button>
    </form>
  );
};

export default UserSearchForm;
