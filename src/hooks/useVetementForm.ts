import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetement/types";

export const useVetementForm = (vetementId?: number) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addVetement = async (formValues: VetementFormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      const vetementData: Omit<Vetement, "id" | "created_at"> = {
        nom: formValues.nom,
        categorie_id: formValues.categorie_id,
        couleur: formValues.couleur,
        taille: formValues.taille,
        description: formValues.description || null,
        marque: formValues.marque || null,
        image_url: formValues.image_url || null,
        user_id: user.id,
        temperature: formValues.temperature || null,
        weather_type: formValues.weather_type || null,
        a_vendre: formValues.a_vendre || false,
        prix_achat: formValues.prix_achat || null,
        prix_vente: formValues.prix_vente || null,
        promo_pourcentage: formValues.promo_pourcentage || null,
        etat: formValues.etat || null,
        lieu_vente: formValues.lieu_vente || null,
        disponibilite: formValues.disponibilite || "disponible",
        infos_vente: formValues.infos_vente || null,
      };

      const { error } = await supabase
        .from('vetements')
        .insert([vetementData]);

      if (error) {
        console.error("Erreur lors de l'ajout du vêtement:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le vêtement. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Vêtement ajouté avec succès!",
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du vêtement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du vêtement.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateVetement = async (formValues: VetementFormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      if (!vetementId || !user) {
        throw new Error("Impossible de mettre à jour le vêtement");
      }
      
      const vetementData: Omit<Vetement, "id" | "created_at"> = {
        nom: formValues.nom,
        categorie_id: formValues.categorie_id,
        couleur: formValues.couleur,
        taille: formValues.taille,
        description: formValues.description || null,
        marque: formValues.marque || null,
        image_url: formValues.image_url || null,
        user_id: user.id,
        temperature: formValues.temperature || null,
        weather_type: formValues.weather_type || null,
        a_vendre: formValues.a_vendre || false,
        prix_achat: formValues.prix_achat || null,
        prix_vente: formValues.prix_vente || null,
        promo_pourcentage: formValues.promo_pourcentage || null,
        etat: formValues.etat || null,
        lieu_vente: formValues.lieu_vente || null,
        disponibilite: formValues.disponibilite || "disponible",
        infos_vente: formValues.infos_vente || null,
      };
      
      const { error } = await supabase
        .from('vetements')
        .update(vetementData)
        .eq('id', vetementId);
      
      if (error) {
        console.error("Erreur lors de la mise à jour du vêtement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le vêtement. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Succès",
        description: "Vêtement mis à jour avec succès!",
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du vêtement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du vêtement.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = useCallback(
    async (formValues: VetementFormValues, isEditMode: boolean) => {
      if (isSubmitting) return false;

      try {
        let success;
        if (isEditMode && vetementId) {
          success = await updateVetement(formValues);
        } else {
          success = await addVetement(formValues);
        }

        if (success) {
          navigate("/mes-vetements");
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        return false;
      }
    },
    [navigate, isSubmitting, vetementId, updateVetement, addVetement]
  );

  return {
    isSubmitting,
    handleFormSubmit,
  };
};
