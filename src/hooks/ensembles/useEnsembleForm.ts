
import { useState } from "react";
import { Vetement } from "@/services/vetement/types";

export type SelectedItems = {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
};

/**
 * Hook to manage the ensemble form state
 */
export const useEnsembleForm = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    haut: null,
    bas: null,
    chaussures: null
  });
  
  const [formData, setFormData] = useState({
    nom: `Ensemble du ${new Date().toLocaleDateString()}`,
    description: "",
    occasion: "",
    saison: ""
  });
  
  const handleItemsSelected = (items: SelectedItems) => {
    setSelectedItems(items);
  };
  
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const isFormValid = () => {
    return (
      formData.nom.trim() !== "" && 
      selectedItems.haut !== null && 
      selectedItems.bas !== null && 
      selectedItems.chaussures !== null
    );
  };

  return {
    selectedItems,
    formData,
    handleItemsSelected,
    handleChange,
    isFormValid
  };
};
