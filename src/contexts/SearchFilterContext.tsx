
import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Categorie } from '@/services/categorieService';
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
  marques: string[];
  friends: Ami[];
  showFriendFilter: boolean;
  resetFilters: () => void;
  onFriendFilterChange?: (friendId: string) => void;
  currentFriendFilter?: string;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export interface SearchFilterProviderProps {
  children: ReactNode;
  categories: Categorie[];
  marques: string[];
  friends?: Ami[];
  showFriendFilter?: boolean;
  onFriendFilterChange?: (friendId: string) => void;
  currentFriendFilter?: string;
}

export const SearchFilterProvider: React.FC<SearchFilterProviderProps> = ({
  children,
  categories,
  marques,
  friends = [],
  showFriendFilter = false,
  onFriendFilterChange,
  currentFriendFilter,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter: internalFriendFilter,
    setFriendFilter: internalSetFriendFilter,
    resetFilters,
  } = useVetementsFilters();

  const setFriendFilter = (value: string) => {
    console.log('Setting friend filter to:', value);
    internalSetFriendFilter(value);
    if (onFriendFilterChange) {
      onFriendFilterChange(value);
    }
  };

  // Synchroniser les filtres externes et internes
  useEffect(() => {
    if (currentFriendFilter && currentFriendFilter !== internalFriendFilter) {
      console.log('Synchronizing friend filter from external source:', currentFriendFilter);
      internalSetFriendFilter(currentFriendFilter);
    }
  }, [currentFriendFilter, internalSetFriendFilter, internalFriendFilter]);

  const value = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter: currentFriendFilter || internalFriendFilter,
    setFriendFilter,
    categories,
    marques,
    friends,
    showFriendFilter,
    resetFilters,
    onFriendFilterChange,
    currentFriendFilter,
  }), [
    searchTerm, categorieFilter, marqueFilter, 
    internalFriendFilter, currentFriendFilter,
    categories, marques, friends, showFriendFilter,
    resetFilters, onFriendFilterChange
  ]);

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
