
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UsersSearchProps {
  onSearch: (term: string) => void;
  isSearching: boolean;
}

const UsersSearch: React.FC<UsersSearchProps> = ({ onSearch, isSearching }) => {
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
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        placeholder="Rechercher par email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isSearching}>
        <Search className="h-4 w-4 mr-2" />
        Rechercher
      </Button>
      {searchTerm && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClear}
          disabled={isSearching}
        >
          Effacer
        </Button>
      )}
    </form>
  );
};

export default UsersSearch;
