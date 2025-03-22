
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEnsembleInitialization } from "./useEnsembleInitialization";
import { useEnsembleVetements } from "./useEnsembleVetements";
import { useEnsembleForm } from "./useEnsembleForm";
import { createEnsemble } from "@/services/ensemble";
import { VetementType } from "@/services/meteo/tenue";

/**
 * Hook to manage ensemble creation process
 */
export const useEnsembleCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initialized } = useEnsembleInitialization();
  const { allVetements, loading: loadingVetements } = useEnsembleVetements();
  const { selectedItems, formData, handleItemsSelected, handleChange, isFormValid } = useEnsembleForm();
  const [creating, setCreating] = useState(false);

  const handleCreateEnsemble = async () => {
    if (!isFormValid()) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un haut, un bas et des chaussures pour créer un ensemble.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setCreating(true);

      // Create the ensemble
      await createEnsemble({
        nom: formData.nom,
        description: formData.description || "Ensemble créé manuellement",
        occasion: formData.occasion,
        saison: formData.saison,
        vetements: [
          {
            id: selectedItems.haut!.id,
            type: VetementType.HAUT
          }, 
          {
            id: selectedItems.bas!.id,
            type: VetementType.BAS
          }, 
          {
            id: selectedItems.chaussures!.id,
            type: VetementType.CHAUSSURES
          }
        ]
      });
      
      toast({
        title: "Ensemble créé",
        description: "Votre ensemble a été créé avec succès.",
        variant: "default"
      });

      // Redirect to ensembles page
      navigate("/ensembles");
    } catch (error) {
      console.error("Erreur lors de la création de l'ensemble:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'ensemble. La base de données est peut-être en cours d'initialisation, veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return {
    // Data
    allVetements,
    loadingVetements,
    selectedItems,
    formData,
    creating,
    
    // Actions
    handleItemsSelected,
    handleChange,
    handleCreateEnsemble
  };
};
