
import { useState, useCallback, useMemo } from "react";
import { Vetement } from "@/services/vetement/types";
import { Categorie } from "@/services/categorieService";

export function useVetementsFilters() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [aVendreFilter, setAVendreFilter] = useState<boolean>(false);
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
    setAVendreFilter(false);
    setCategoryTab("all");
  }, []);

  const filterVetements = useCallback((vetements: Vetement[], categories: Categorie[]) => {
    if (!Array.isArray(vetements)) {
      console.warn("Les vêtements ne sont pas un tableau:", vetements);
      return [];
    }

    console.log("Filtrage avec friendFilter:", friendFilter);
    console.log("Filtrage avec aVendreFilter:", aVendreFilter);
    console.log("Vêtements avant filtrage:", vetements.length);

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

      // Filtre par ami (pour le mode 'vetements-amis')
      // Assurons-nous que le filtrage fonctionne correctement
      const friendMatch = friendFilter === "all" || 
        (viewMode === 'vetements-amis' && friendFilter !== "all" && vetement.user_id === friendFilter);
        
      // Filtre pour "À vendre"
      const aVendreMatch = !aVendreFilter || vetement.a_vendre === true;

      if (viewMode === 'vetements-amis' && friendFilter !== "all") {
        console.log(
          "Vêtement", vetement.id, vetement.nom, 
          "user_id:", vetement.user_id, 
          "friendFilter:", friendFilter, 
          "match:", vetement.user_id === friendFilter
        );
      }

      return searchMatch && categoryMatch && marqueMatch && aVendreMatch && 
        (viewMode !== 'vetements-amis' || friendFilter === "all" || friendMatch);
    });
  }, [searchTerm, categorieFilter, marqueFilter, friendFilter, aVendreFilter, viewMode]);

  return {
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
