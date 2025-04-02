
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchEnsembles, updateEnsemble } from "@/services/ensemble";
import { Ensemble } from "@/services/ensemble";
import { VetementType } from "@/services/meteo/tenue";
import { Vetement } from "@/services/vetement/types";
import { determineVetementTypeSync } from "@/components/ensembles/utils/vetementTypeUtils";

export interface ModifierEnsembleFormData {
  nom: string;
  description: string;
  occasion: string;
  saison: string;
  selectedItems: {
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  };
}

export const useModifierEnsemble = (ensembleId: number) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<ModifierEnsembleFormData>({
    nom: "",
    description: "",
    occasion: "",
    saison: "",
    selectedItems: {
      haut: null,
      bas: null,
      chaussures: null
    }
  });

  // Load the ensemble data
  useEffect(() => {
    const loadEnsemble = async () => {
      if (!ensembleId) return;
      
      try {
        setLoading(true);
        const ensembles = await fetchEnsembles();
        const found = ensembles.find(e => e.id === ensembleId);
        
        if (!found) {
          toast({
            title: "Erreur",
            description: "Ensemble introuvable",
            variant: "destructive"
          });
          navigate("/ensembles");
          return;
        }
        
        setEnsemble(found);
        setFormData({
          nom: found.nom,
          description: found.description || "",
          occasion: found.occasion || "",
          saison: found.saison || "",
          selectedItems: {
            haut: null,
            bas: null,
            chaussures: null
          }
        });
      } catch (error) {
        console.error("Erreur lors du chargement de l'ensemble:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'ensemble",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEnsemble();
  }, [ensembleId, navigate, toast]);

  // Initialize selected items when ensemble and vetements are loaded
  const initializeSelectedItems = (allVetements: Vetement[]) => {
    if (!ensemble) return;

    // Find the vetements for each type
    const hautVetement = ensemble.vetements.find(v => 
      determineVetementTypeSync(v.vetement) === VetementType.HAUT
    )?.vetement || null;
    
    const basVetement = ensemble.vetements.find(v => 
      determineVetementTypeSync(v.vetement) === VetementType.BAS
    )?.vetement || null;
    
    const chaussuresVetement = ensemble.vetements.find(v => 
      determineVetementTypeSync(v.vetement) === VetementType.CHAUSSURES
    )?.vetement || null;
    
    setFormData(prev => ({
      ...prev,
      selectedItems: {
        haut: hautVetement,
        bas: basVetement,
        chaussures: chaussuresVetement
      }
    }));
  };

  // Handle form changes
  const handleChange = (field: keyof Omit<ModifierEnsembleFormData, 'selectedItems'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle item selection
  const handleItemsSelected = (items: {
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      selectedItems: items
    }));
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!formData.selectedItems.haut || !formData.selectedItems.bas || !formData.selectedItems.chaussures) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un haut, un bas et des chaussures pour cet ensemble.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const updateData = {
        id: ensembleId,
        nom: formData.nom,
        description: formData.description,
        occasion: formData.occasion,
        saison: formData.saison,
        vetements: [
          {
            id: formData.selectedItems.haut.id,
            type: VetementType.HAUT
          },
          {
            id: formData.selectedItems.bas.id,
            type: VetementType.BAS
          },
          {
            id: formData.selectedItems.chaussures.id,
            type: VetementType.CHAUSSURES
          }
        ]
      };
      
      await updateEnsemble(updateData);
      
      toast({
        title: "Succès",
        description: "L'ensemble a été modifié avec succès"
      });
      
      navigate("/ensembles");
    } catch (error) {
      console.error("Erreur lors de la modification de l'ensemble:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'ensemble",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    ensemble,
    formData,
    loading,
    saving,
    handleChange,
    handleItemsSelected,
    handleSubmit,
    initializeSelectedItems
  };
};
