
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent) => void;
  onAddNew: () => void;
  addButtonText?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onAddNew,
  addButtonText = "Ajouter"
}) => {
  return (
    <div className="flex items-center gap-2">
      <form onSubmit={onSearchSubmit} className="flex items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-8 md:w-[300px]"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        <Button type="submit" variant="ghost" className="ml-2">
          Rechercher
        </Button>
      </form>
      <Button onClick={onAddNew} className="gap-1">
        <Plus className="h-4 w-4" /> {addButtonText}
      </Button>
    </div>
  );
};

export default SearchBar;
