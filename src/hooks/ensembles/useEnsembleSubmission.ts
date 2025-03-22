
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Vetement } from "@/services/vetement/types";
import { createEnsemble } from "@/services/ensemble";
import { VetementType } from "@/services/meteo/tenue";

export type SelectedItems = {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
};

export const useEnsembleSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  
  const submitEnsemble = async (selectedItems: SelectedItems) => {
    // Check that all items are selected
    if (!selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures) {
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
        nom: `Ensemble du ${new Date().toLocaleDateString()}`,
        description: "Ensemble créé manuellement",
        vetements: [{
          id: selectedItems.haut.id,
          type: VetementType.HAUT
        }, {
          id: selectedItems.bas.id,
          type: VetementType.BAS
        }, {
          id: selectedItems.chaussures.id,
          type: VetementType.CHAUSSURES
        }]
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

  return { creating, submitEnsemble };
};
