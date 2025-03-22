
import { useState, useCallback, useMemo } from "react";
import { Vetement } from "@/services/vetement/types";
import { Categorie } from "@/services/categorieService";

export function useVetementsFilters() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis' | 'mes-ensembles'>('mes-vetements');
  const [activeTab, setActiveTab] = useState<string>("mes-vetements");
  const [categoryTab, setCategoryTab] = useState<string>("all");

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis' | 'mes-ensembles') => {
    setViewMode(mode);
  };

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setCategorieFilter("all");
    setMarqueFilter("all");
    setFriendFilter("all");
    setCategoryTab("all");
  }, []);

  const filterVetements = useCallback((vetements: Vetement[], categories: Categorie[]) => {
    if (!Array.isArray(vetements)) {
      console.warn("Les vêtements ne sont pas un tableau:", vetements);
      return [];
    }

    return vetements.filter(vetement => {
      // Filtre par terme de recherche
      const searchMatch = !searchTerm || 
        vetement.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vetement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vetement.marque?.toLowerCase().includes(searchTerm.toLowerCase());

      // Récupérer le nom de la catégorie à partir de l'ID
      const category = categories.find(cat => cat.id === vetement.categorie_id);
      const categoryName = category ? category.nom : "Catégorie inconnue";

      // Filtre par catégorie
      const categoryMatch = categorieFilter === "all" || 
        (category && category.nom === categorieFilter);

      // Filtre par marque
      const marqueMatch = marqueFilter === "all" || 
        vetement.marque === marqueFilter;

      // Filtre par ami (uniquement pour le mode 'vetements-amis')
      const friendMatch = friendFilter === "all" || 
        (viewMode === 'vetements-amis' && vetement.owner_email === friendFilter);

      return searchMatch && categoryMatch && marqueMatch && 
        (viewMode !== 'vetements-amis' || friendMatch);
    });
  }, [searchTerm, categorieFilter, marqueFilter, friendFilter, viewMode]);

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
    resetFilters,
    activeTab,
    setActiveTab,
    categoryTab,
    setCategoryTab
  };
}
