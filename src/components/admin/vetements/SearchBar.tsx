
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onAddNew: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onAddNew
}) => {
  return (
    <div className="flex gap-3">
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <Input
          placeholder="Rechercher un vêtement..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-64"
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      <Button onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-2" />
        Ajouter
      </Button>
    </div>
  );
};

export default SearchBar;
