
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from 'lucide-react';

interface AdminUserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  loading: boolean;
}

const AdminUserSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  loading 
}: AdminUserSearchProps) => {
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
      <Input
        placeholder="Rechercher par email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full"
      />
      <Button 
        type="button" 
        size="icon" 
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default AdminUserSearch;
