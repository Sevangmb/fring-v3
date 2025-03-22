
import { useState, useCallback } from "react";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement";

export function useVetementsFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis' | 'mes-ensembles'>('mes-vetements');

  const getCategoryNameById = (categories: Categorie[], categoryId: number): string => {
    const category = categories.find(cat => Number(cat.id) === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  const filterVetements = useCallback((vetements: Vetement[], categories: Categorie[]): Vetement[] => {
    console.log('Filtering vetements with:', {
      searchTerm,
      categorieFilter,
      marqueFilter
    });
    
    return vetements.filter(vetement => {
      // Filtrage par terme de recherche
      const matchesSearch = searchTerm.trim() === "" || 
                          vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vetement.owner_email && vetement.owner_email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtrage par catégorie
      let matchesCategorie = true;
      if (categorieFilter && categorieFilter !== "all") {
        const categoryName = getCategoryNameById(categories, vetement.categorie_id);
        matchesCategorie = categoryName === categorieFilter;
      }
      
      // Filtrage par marque
      let matchesMarque = true;
      if (marqueFilter && marqueFilter !== "all") {
        matchesMarque = vetement.marque === marqueFilter;
      }

      return matchesSearch && matchesCategorie && matchesMarque;
    });
  }, [searchTerm, categorieFilter, marqueFilter]);

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis' | 'mes-ensembles') => {
    setViewMode(mode);
    resetFilters();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategorieFilter("all");
    setMarqueFilter("all");
    setFriendFilter("all");
  };

  return {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
    viewMode,
    handleViewModeChange,
    filterVetements,
    resetFilters
  };
}
