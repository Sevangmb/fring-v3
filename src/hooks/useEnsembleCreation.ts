
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Vetement } from "@/services/vetement/types";
import { fetchVetements, fetchVetementsAmis } from "@/services/vetement";
import { createEnsemble } from "@/services/ensembleService";
import { VetementType } from "@/services/meteo/tenue";
import { initializeEnsembleData } from "@/services/database/ensembleInitialization";

export const useEnsembleCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allVetements, setAllVetements] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }>({
    haut: null,
    bas: null,
    chaussures: null
  });
  const [creating, setCreating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize database structure
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeEnsembleData();
        setInitialized(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      }
    };
    initialize();
  }, []);

  // Load all clothing items (personal and friends')
  useEffect(() => {
    const loadAllVetements = async () => {
      try {
        setLoading(true);
        // Load both personal and friends' clothing
        const [mesVetementsData, vetementsAmisData] = await Promise.all([
          fetchVetements(),
          fetchVetementsAmis()
        ]);
        
        // Combine the two sources
        const combinedVetements = [
          ...mesVetementsData, 
          ...vetementsAmisData
        ];
        
        setAllVetements(combinedVetements);
        console.log("Tous les vêtements chargés:", combinedVetements.length);
      } catch (error) {
        console.error("Erreur lors du chargement des vêtements:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les vêtements.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAllVetements();
  }, [toast]);
  
  const handleCreateEnsemble = async () => {
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

  return {
    allVetements,
    loading,
    selectedItems,
    creating,
    setSelectedItems,
    handleCreateEnsemble
  };
};
