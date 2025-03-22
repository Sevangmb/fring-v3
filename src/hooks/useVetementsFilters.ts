
import { useState } from "react";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement";

export function useVetementsFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("tous");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis' | 'mes-ensembles'>('mes-vetements');

  const getCategoryNameById = (categories: Categorie[], categoryId: number): string => {
    const category = categories.find(cat => Number(cat.id) === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  const filterVetements = (vetements: Vetement[], categories: Categorie[]): Vetement[] => {
    return vetements.filter(vetement => {
      // Filtrage par terme de recherche
      const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
      
      // Filtrage par onglet actif (catégorie)
      let matchesActiveTab = true;
      if (activeTab !== "tous") {
        const categoryName = getCategoryNameById(categories, vetement.categorie_id);
        matchesActiveTab = categoryName === activeTab;
      }

      return matchesSearch && matchesCategorie && matchesMarque && matchesActiveTab;
    });
  };

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis' | 'mes-ensembles') => {
    setViewMode(mode);
    resetFilters();
  };

  const resetFilters = () => {
    setActiveTab("tous");
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
    activeTab,
    setActiveTab,
    viewMode,
    handleViewModeChange,
    filterVetements,
    resetFilters
  };
}
