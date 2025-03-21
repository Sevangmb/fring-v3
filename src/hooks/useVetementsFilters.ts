
import { useState } from "react";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement";

export function useVetementsFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("");
  const [marqueFilter, setMarqueFilter] = useState<string>("");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("tous");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis'>('mes-vetements');

  const getCategoryNameById = (categories: Categorie[], categoryId: number): string => {
    const category = categories.find(cat => Number(cat.id) === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  const filterVetements = (vetements: Vetement[], categories: Categorie[]): Vetement[] => {
    return vetements.filter(vetement => {
      const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (vetement.owner_email && vetement.owner_email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategorie = categorieFilter 
        ? categorieFilter === "all" 
          ? true 
          : getCategoryNameById(categories, vetement.categorie_id) === categorieFilter 
        : true;
      
      const matchesMarque = marqueFilter ? marqueFilter === "all" ? true : vetement.marque === marqueFilter : true;
      
      if (activeTab === "tous") {
        return matchesSearch && matchesCategorie && matchesMarque;
      } else {
        return matchesSearch && matchesCategorie && matchesMarque && getCategoryNameById(categories, vetement.categorie_id) === activeTab;
      }
    });
  };

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis') => {
    setViewMode(mode);
    setActiveTab("tous");
    setSearchTerm("");
    setCategorieFilter("");
    setMarqueFilter("");
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
    filterVetements
  };
}
