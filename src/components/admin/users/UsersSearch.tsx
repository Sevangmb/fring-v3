
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, UserPlus } from 'lucide-react';

interface UsersSearchProps {
  onSearch: (term: string) => void;
  isSearching: boolean;
  onAddUser?: () => void;
}

const UsersSearch: React.FC<UsersSearchProps> = ({ onSearch, isSearching, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Utilisateurs</h3>
        {onAddUser && (
          <Button 
            size="sm" 
            onClick={onAddUser}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Effacer</span>
            </button>
          )}
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Recherche..." : "Rechercher"}
        </Button>
      </form>
    </div>
  );
};

export default UsersSearch;
