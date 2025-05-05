
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Categorie } from '@/services/categorieService';
import { Ami } from '@/services/amis/types';

interface SearchFilterContextProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categorieFilter: string;
  setCategorieFilter: (categorie: string) => void;
  marqueFilter: string;
  setMarqueFilter: (marque: string) => void;
  friendFilter: string;
  setFriendFilter: (friendId: string) => void;
  aVendreFilter: boolean;
  setAVendreFilter: (aVendre: boolean) => void;
  resetFilters: () => void;
  // Les options disponibles pour les filtres
  categories: Categorie[];
  marques: string[];
  friends: Ami[];
  // Configuration du filtre d'amis
  showFriendFilter: boolean;
  onFriendFilterChange?: (friendId: string) => void;
  currentFriendFilter?: string;
}

const SearchFilterContext = createContext<SearchFilterContextProps | undefined>(undefined);

interface SearchFilterProviderProps {
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
  categories = [],
  marques = [],
  friends = [],
  showFriendFilter = false,
  onFriendFilterChange,
  currentFriendFilter = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [marqueFilter, setMarqueFilter] = useState('all');
  const [friendFilter, setFriendFilter] = useState(currentFriendFilter);
  const [aVendreFilter, setAVendreFilter] = useState(false);

  const resetFilters = () => {
    setSearchTerm('');
    setCategorieFilter('all');
    setMarqueFilter('all');
    setFriendFilter('all');
    setAVendreFilter(false);
    if (onFriendFilterChange) {
      onFriendFilterChange('all');
    }
  };

  return (
    <SearchFilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        categorieFilter,
        setCategorieFilter,
        marqueFilter,
        setMarqueFilter,
        friendFilter,
        setFriendFilter,
        aVendreFilter,
        setAVendreFilter,
        resetFilters,
        categories,
        marques,
        friends,
        showFriendFilter,
        onFriendFilterChange,
        currentFriendFilter
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = (): SearchFilterContextProps => {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error('useSearchFilter doit être utilisé à l\'intérieur d\'un SearchFilterProvider');
  }
  return context;
};
