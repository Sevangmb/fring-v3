
import React, { createContext, useContext, ReactNode } from 'react';
import { Categorie } from '@/services/categorieService';
import { Marque } from '@/services/marqueService';
import { Ami } from '@/services/amis';
import { useVetementsFilters } from '@/hooks/useVetementsFilters';

interface SearchFilterContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categorieFilter: string;
  setCategorieFilter: (value: string) => void;
  marqueFilter: string;
  setMarqueFilter: (value: string) => void;
  friendFilter: string;
  setFriendFilter: (value: string) => void;
  categories: Categorie[];
  marques: Marque[];
  friends: Ami[];
  showFriendFilter: boolean;
  resetFilters: () => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export interface SearchFilterProviderProps {
  children: ReactNode;
  categories: Categorie[];
  marques: Marque[];
  friends?: Ami[];
  showFriendFilter?: boolean;
}

export const SearchFilterProvider: React.FC<SearchFilterProviderProps> = ({
  children,
  categories,
  marques,
  friends = [],
  showFriendFilter = false,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
    resetFilters,
  } = useVetementsFilters();

  const value = {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
    categories,
    marques,
    friends,
    showFriendFilter,
    resetFilters,
  };

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = (): SearchFilterContextType => {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
};
