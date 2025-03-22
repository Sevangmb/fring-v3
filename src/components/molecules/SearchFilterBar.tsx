
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, TagIcon, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSearchFilter } from '@/contexts/SearchFilterContext';
import { useCategories } from '@/hooks/useCategories';

const SearchFilterBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    resetFilters,
    marques
  } = useSearchFilter();
  const {
    categories,
    loadingCategories
  } = useCategories();

  // Déboguer les états des filtres
  useEffect(() => {
    console.log('SearchFilterBar filters:', {
      categorieFilter,
      marqueFilter,
      availableCategories: categories
    });
  }, [categorieFilter, marqueFilter, categories]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleResetFilters = () => {
    resetFilters();
  };
  
  return <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Rechercher un vêtement..." className="pl-10" value={searchTerm} onChange={handleSearchChange} />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Select value={categorieFilter} onValueChange={setCategorieFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Catégorie" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {loadingCategories ? <SelectItem value="loading" disabled>Chargement...</SelectItem> : categories.map(cat => <SelectItem key={String(cat.id)} value={cat.nom}>
                  {cat.nom}
                </SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select value={marqueFilter} onValueChange={setMarqueFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <TagIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Marque" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {marques.map(marque => {
              // Handle both string marques and marque objects
              const marqueValue = typeof marque === 'string' ? marque : marque.nom;
              return (
                <SelectItem key={marqueValue} value={marqueValue}>
                  {marqueValue}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="flex items-center" onClick={handleResetFilters}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
        
        
      </div>
    </div>;
};
export default SearchFilterBar;
