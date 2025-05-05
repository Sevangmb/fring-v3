
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Ami } from "@/services/amis/types";

interface SearchFilterContextProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categorieFilter: string;
  setCategorieFilter: (value: string) => void;
  marqueFilter: string;
  setMarqueFilter: (value: string) => void;
  friendFilter: string;
  setFriendFilter: (value: string) => void;
  resetFilters: () => void;
  categories: any[];
  marques: string[];
  friends: Ami[];
  showFriendFilter: boolean;
  onFriendFilterChange?: (friendId: string) => void;
  currentFriendFilter?: string;
}

const SearchFilterContext = createContext<SearchFilterContextProps>({
  searchTerm: "",
  setSearchTerm: () => {},
  categorieFilter: "all",
  setCategorieFilter: () => {},
  marqueFilter: "all",
  setMarqueFilter: () => {},
  friendFilter: "all",
  setFriendFilter: () => {},
  resetFilters: () => {},
  categories: [],
  marques: [],
  friends: [],
  showFriendFilter: false,
  onFriendFilterChange: undefined,
  currentFriendFilter: undefined
});

interface SearchFilterProviderProps {
  children: ReactNode;
  categories: any[];
  marques?: string[];
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
  currentFriendFilter = "all"
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");
  const [friendFilter, setFriendFilter] = useState<string>(currentFriendFilter);

  React.useEffect(() => {
    // Mettre à jour le filtre d'ami lorsque la prop change
    if (currentFriendFilter !== undefined) {
      setFriendFilter(currentFriendFilter);
    }
  }, [currentFriendFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategorieFilter("all");
    setMarqueFilter("all");
    setFriendFilter("all");
    
    // Si une fonction de rappel est fournie, informer le parent du changement
    if (onFriendFilterChange) {
      onFriendFilterChange("all");
    }
  };

  // Effet pour le debug
  React.useEffect(() => {
    console.log("SearchFilterContext - État actuel:", {
      searchTerm,
      categorieFilter,
      marqueFilter,
      friendFilter,
      currentFriendFilter,
      showFriendFilter,
      amis: friends.length
    });
  }, [searchTerm, categorieFilter, marqueFilter, friendFilter, currentFriendFilter, showFriendFilter, friends.length]);

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
        showFriendFilter,
        onFriendFilterChange,
        currentFriendFilter
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => useContext(SearchFilterContext);
