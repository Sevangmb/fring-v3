
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { detectImageInfo } from "@/services/colorDetection";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";

/**
 * Hook personnalisé pour gérer la détection de couleur et de catégorie
 */
export const useColorDetection = (
  form: UseFormReturn<VetementFormValues>,
  imagePreview: string | null
) => {
  const { toast } = useToast();
  const [detectingColor, setDetectingColor] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [detectionSteps, setDetectionSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const addStep = (step: string) => {
    setDetectionSteps(prev => [...prev, step]);
    setCurrentStep(step);
    console.log(`Étape de détection: ${step}`);
  };

  const handleDetectImage = async () => {
    if (!imagePreview) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord télécharger une image à analyser.",
        variant: "destructive",
      });
      return;
    }

    // Réinitialiser l'état
    setDetectionError(null);
    setDetectingColor(true);
    setDetectionSteps([]);
    setCurrentStep(null);
    
    try {
      // Créer le toast pour notification
      const toastId = toast({
        title: "Détection en cours",
        description: "Analyse de l'image avec Mistral AI (peut prendre jusqu'à 30 secondes)...",
        duration: 30000, // Augmenter la durée pour correspondre au timeout de la fonction
      });
      
      addStep("1. Préparation de l'image pour l'analyse avec Mistral AI");
      console.log("Envoi de l'image pour détection:", imagePreview.substring(0, 50) + "...");
      
      addStep("2. Appel du service de détection Mistral AI");
      const detectedInfo = await detectImageInfo(imagePreview, (step) => {
        addStep(step);
      });
      
      // Fermer le toast précédent
      toast({
        id: toastId.id,
        title: "Détection terminée",
        description: "Analyse terminée avec succès",
        duration: 0,
      });
      
      addStep(`3. Informations détectées: couleur=${detectedInfo.color}, catégorie=${detectedInfo.category}`);
      console.log("Informations détectées:", detectedInfo);
      
      // Définir la couleur détectée
      form.setValue('couleur', detectedInfo.color);
      
      // Définir la catégorie détectée
      form.setValue('categorie', detectedInfo.category);
      
      // Définir les autres champs disponibles si possible
      if (detectedInfo.category === "T-shirt") {
        // Pré-remplir les tailles communes pour les T-shirts
        form.setValue('taille', 'M');
      } else if (detectedInfo.category === "Pantalon" || detectedInfo.category === "Jeans") {
        // Pré-remplir les tailles communes pour les pantalons
        form.setValue('taille', '40');
      }
      
      // Suggérer un nom basé sur la couleur et la catégorie
      const suggestedName = `${detectedInfo.color.charAt(0).toUpperCase() + detectedInfo.color.slice(1)} ${detectedInfo.category.toLowerCase()}`;
      form.setValue('nom', suggestedName);
      
      addStep("4. Application des valeurs détectées au formulaire");
      toast({
        title: "Détection réussie",
        description: `La couleur ${detectedInfo.color}, la catégorie ${detectedInfo.category} et d'autres champs ont été pré-remplis`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Erreur lors de la détection:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur inconnue lors de la détection";
      
      setDetectionError("La détection automatique a rencontré un problème. Veuillez vérifier votre connexion ou saisir les valeurs manuellement.");
      addStep(`Erreur: ${errorMessage}`);
      
      toast({
        title: "Échec de la détection",
        description: "Impossible de détecter automatiquement les informations du vêtement. Veuillez les saisir manuellement.",
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setDetectingColor(false);
    }
  };

  return {
    detectingColor,
    setDetectingColor,
    detectionError,
    detectionSteps,
    currentStep,
    handleDetectImage
  };
};
