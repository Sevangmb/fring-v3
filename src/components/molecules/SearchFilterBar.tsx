
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, TagIcon, Plus } from "lucide-react";
import { Categorie } from '@/services/categorieService';
import { Marque } from '@/services/marqueService';
import { useNavigate } from 'react-router-dom';

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categorieFilter: string;
  setCategorieFilter: (value: string) => void;
  marqueFilter: string;
  setMarqueFilter: (value: string) => void;
  categories: Categorie[];
  marques: Marque[];
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  categorieFilter,
  setCategorieFilter,
  marqueFilter,
  setMarqueFilter,
  categories,
  marques
}) => {
  const navigate = useNavigate();

  const handleReset = () => {
    setSearchTerm("");
    setCategorieFilter("");
    setMarqueFilter("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un vêtement..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.nom}>
                {cat.nom}
              </SelectItem>
            ))}
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
            {marques.map((marque) => (
              <SelectItem key={marque.id} value={marque.nom}>
                {marque.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={handleReset}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
        
        <Button 
          onClick={() => navigate("/mes-vetements/ajouter")}
          className="hidden md:flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
