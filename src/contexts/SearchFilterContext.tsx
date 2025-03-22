
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Categorie } from '@/services/categorieService';
import { useCategories } from '@/hooks/useCategories';

interface SearchFilterContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categorieFilter: string;
  setCategorieFilter: (categorie: string) => void;
  marqueFilter: string;
  setMarqueFilter: (marque: string) => void;
  friendFilter: string;
  setFriendFilter: (friend: string) => void;
  resetFilters: () => void;
  categories: Categorie[];
  marques: string[];
  friends: any[];
  showFriendFilter: boolean;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

interface SearchFilterProviderProps {
  children: ReactNode;
  categories?: Categorie[];
  marques?: string[];
  friends?: any[];
  showFriendFilter?: boolean;
}

export const SearchFilterProvider: React.FC<SearchFilterProviderProps> = ({
  children,
  categories: initialCategories,
  marques: initialMarques = [],
  friends: initialFriends = [],
  showFriendFilter = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [marqueFilter, setMarqueFilter] = useState('all');
  const [friendFilter, setFriendFilter] = useState('all');
  
  // Utiliser le hook useCategories pour récupérer les catégories de la base de données
  const { categories: dbCategories, loadingCategories } = useCategories();
  
  // État local pour les catégories et les marques
  const [categories, setCategories] = useState<Categorie[]>(initialCategories || []);
  const [marques, setMarques] = useState<string[]>(initialMarques);
  const [friends, setFriends] = useState<any[]>(initialFriends);

  // Mise à jour des catégories lorsque les catégories de la base de données sont chargées
  useEffect(() => {
    if (dbCategories && dbCategories.length > 0) {
      setCategories(dbCategories);
    } else if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [dbCategories, initialCategories]);
  
  // Mise à jour des marques lorsque les props changent
  useEffect(() => {
    if (initialMarques && initialMarques.length > 0) {
      setMarques(initialMarques);
    }
  }, [initialMarques]);

  // Mise à jour des amis lorsque les props changent
  useEffect(() => {
    if (initialFriends && initialFriends.length > 0) {
      setFriends(initialFriends);
    }
  }, [initialFriends]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategorieFilter('all');
    setMarqueFilter('all');
    setFriendFilter('all');
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
        resetFilters,
        categories,
        marques,
        friends,
        showFriendFilter
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
};
