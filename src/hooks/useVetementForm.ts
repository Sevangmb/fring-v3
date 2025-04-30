
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VetementFormValues, vetementFormSchema } from "@/components/vetements/schema/VetementFormSchema";
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetement/types";

export const useVetementForm = (
  user?: any, 
  initialValues?: VetementFormValues,
  onSubmit?: (data: VetementFormValues) => Promise<void>,
  mode: "create" | "update" = "create"
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image_url || null);

  // Form initialization with zod validation
  const form = useForm<VetementFormValues>({
    resolver: zodResolver(vetementFormSchema),
    defaultValues: initialValues || {
      nom: '',
      categorie_id: 0,
      couleur: '',
      taille: '',
      marque: '',
      description: '',
      temperature: undefined,
      weather_type: undefined,
      a_vendre: false,
      prix_achat: undefined,
      prix_vente: undefined,
      lieu_vente: '',
      infos_vente: '',
      promo_pourcentage: undefined,
      etat: undefined,
      disponibilite: 'disponible'
    },
  });

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

  const updateVetement = async (vetementId: number, formValues: VetementFormValues): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      if (!user) {
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

  const handleSubmit = async (formValues: VetementFormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      if (onSubmit) {
        await onSubmit(formValues);
      } else if (mode === "update") {
        // For security, this path should not be taken normally
        console.warn("Tentative de mise à jour sans ID de vêtement ou sans fonction de soumission personnalisée");
      } else {
        const success = await addVetement(formValues);
        if (success) {
          navigate("/mes-vetements");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    imagePreview,
    setImagePreview,
    loading,
    handleSubmit,
    handleFormSubmit: async (formValues: VetementFormValues, isEditMode: boolean) => {
      // This function is used in tests but we provide a simplified implementation
      return false;
    }
  };
};
