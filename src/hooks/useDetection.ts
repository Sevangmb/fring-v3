
import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import DetectionService from "@/services/detection/detectionService";

/**
 * Hook pour gérer la détection de couleur et de catégorie
 */
export const useDetection = (
  form: UseFormReturn<VetementFormValues>,
  imagePreview: string | null
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  /**
   * Ajouter une étape au processus de détection
   */
  const addStep = useCallback((step: string) => {
    setSteps(prev => [...prev, step]);
    setCurrentStep(step);
    console.log(`Étape de détection: ${step}`);
  }, []);

  /**
   * Lancer la détection automatique
   */
  const detectImage = useCallback(async () => {
    if (!imagePreview) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord télécharger une image à analyser.",
        variant: "destructive",
      });
      return;
    }

    // Réinitialiser l'état
    setError(null);
    setLoading(true);
    setSteps([]);
    setCurrentStep(null);
    
    try {
      // Créer le toast pour notification
      const toastNotification = toast({
        title: "Détection en cours",
        description: "Analyse de l'image avec Google AI Gemini...",
        duration: 30000,
      });
      
      addStep("1. Préparation de l'image pour l'analyse avec Google AI Gemini");
      addStep("2. Appel du service de détection Google AI Gemini");
      
      // Appeler le service de détection
      const result = await DetectionService.detectClothingInfo(imagePreview, addStep);
      
      // Fermer le toast précédent
      toastNotification.dismiss();
      
      addStep(`3. Informations détectées: couleur=${result.color}, catégorie=${result.category}`);
      
      // Appliquer les résultats au formulaire
      
      // 1. Définir la couleur détectée
      form.setValue('couleur', result.color);
      
      // 2. Définir la catégorie détectée
      form.setValue('categorie', result.category);
      
      // 3. Définir la description si disponible
      if (result.description) {
        form.setValue('description', result.description);
        addStep(`4. Description détectée: ${result.description}`);
      }
      
      // 4. Suggérer un nom basé sur la couleur et la catégorie
      const suggestedName = `${result.color.charAt(0).toUpperCase() + result.color.slice(1)} ${result.category.toLowerCase()}`;
      form.setValue('nom', suggestedName);
      
      // 5. Pré-remplir la taille en fonction de la catégorie
      if (result.category === "T-shirt" || result.category === "Chemise" || result.category === "Pull") {
        form.setValue('taille', 'M');
      } else if (result.category === "Pantalon" || result.category === "Jeans") {
        form.setValue('taille', '40');
      } else if (result.category === "Chaussures") {
        form.setValue('taille', '42');
      } else {
        form.setValue('taille', 'M'); // Taille par défaut
      }
      
      // 6. Pré-remplir la marque si détectée
      if (result.brand) {
        form.setValue('marque', result.brand);
        addStep(`5. Marque détectée: ${result.brand}`);
      }

      // 7. Définir la température si détectée
      if (result.temperature) {
        form.setValue('temperature', result.temperature);
        addStep(`6. Température détectée: ${result.temperature}`);
      }
      
      // 8. Définir le type de météo si détecté
      if (result.weatherType) {
        form.setValue('weatherType', result.weatherType);
        addStep(`7. Type de météo détecté: ${result.weatherType}`);
      }
      
      addStep("8. Application des valeurs détectées au formulaire");
      
      // Notification de succès
      toast({
        title: "Détection réussie",
        description: `Catégorie: ${result.category}, Couleur: ${result.color}`,
        duration: 5000,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      
      setError("La détection automatique a rencontré un problème. Veuillez vérifier votre connexion ou saisir les valeurs manuellement.");
      addStep(`Erreur: ${errorMessage}`);
      
      toast({
        title: "Échec de la détection",
        description: "Impossible de détecter automatiquement les informations du vêtement. Veuillez les saisir manuellement.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setLoading(false);
    }
  }, [imagePreview, form, toast, addStep]);

  return {
    loading,
    error,
    steps,
    currentStep,
    detectImage
  };
};

export default useDetection;
