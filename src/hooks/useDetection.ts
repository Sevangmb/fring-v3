
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

// Type pour les étapes de détection
export interface DetectionStep {
  id: string;
  label: string;
  completed: boolean;
}

export const useDetection = (
  form: UseFormReturn<VetementFormValues>,
  imageUrl: string | null
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<DetectionStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // Fonction pour détecter les informations sur l'image
  const detectImage = async () => {
    if (!imageUrl) {
      setError("Aucune image n'a été sélectionnée");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSteps([]);
      setCurrentStep("Préparation de l'image...");
      
      // Étape 1: Préparation
      addStep({
        id: "preparation",
        label: "Préparation de l'image",
        completed: true
      });
      
      // Étape 2: Analyse
      setCurrentStep("Analyse de l'image...");
      
      // Appel de la fonction Edge pour détecter la couleur et la catégorie
      const { data, error } = await supabase.functions.invoke('detect-color', {
        body: { imageUrl }
      });
      
      if (error) {
        throw new Error(`Erreur lors de l'analyse: ${error.message}`);
      }
      
      addStep({
        id: "analyse",
        label: "Analyse de l'image terminée",
        completed: true
      });
      
      // Étape 3: Application des résultats
      setCurrentStep("Application des résultats...");
      
      console.log("Résultats détectés:", data);
      
      if (data?.color) {
        form.setValue('couleur', data.color);
      }
      
      // Si une catégorie a été détectée, la définir
      if (data?.category) {
        const categoryId = await findCategoryIdByName(data.category);
        if (categoryId) {
          form.setValue('categorie_id', categoryId);
        }
      }
      
      // Si une température a été détectée
      if (data?.temperature) {
        form.setValue('temperature', data.temperature);
      }
      
      // Si un type de météo a été détecté
      if (data?.weatherType) {
        form.setValue('weatherType', data.weatherType);
      }
      
      addStep({
        id: "resultats",
        label: "Résultats appliqués",
        completed: true
      });
      
      // Notification de succès
      toast({
        title: "Détection réussie",
        description: "Les informations ont été détectées et appliquées au formulaire.",
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la détection";
      console.error("Erreur de détection:", err);
      setError(errorMessage);
      
      toast({
        title: "Erreur de détection",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  // Ajouter une étape au processus
  const addStep = (step: DetectionStep) => {
    setSteps(prev => [...prev, step]);
  };
  
  // Trouver l'ID d'une catégorie par son nom
  const findCategoryIdByName = async (categoryName: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nom')
        .ilike('nom', `%${categoryName}%`)
        .limit(1);
      
      if (error) {
        console.error("Erreur lors de la recherche de la catégorie:", error);
        return null;
      }
      
      if (data && data.length > 0) {
        console.log(`Catégorie trouvée: ${data[0].nom} (ID: ${data[0].id})`);
        return data[0].id;
      }
      
      console.log(`Aucune catégorie correspondante trouvée pour: ${categoryName}`);
      return null;
    } catch (err) {
      console.error("Erreur lors de la recherche de la catégorie:", err);
      return null;
    }
  };

  return {
    loading,
    error,
    steps,
    currentStep,
    detectImage
  };
};
