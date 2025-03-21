
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
      const toastNotification = toast({
        title: "Détection en cours",
        description: "Analyse de l'image avec Google AI Gemini (peut prendre jusqu'à 30 secondes)...",
        duration: 30000, // Augmenter la durée pour correspondre au timeout de la fonction
      });
      
      addStep("1. Préparation de l'image pour l'analyse avec Google AI Gemini");
      console.log("Envoi de l'image pour détection:", imagePreview.substring(0, 50) + "...");
      
      addStep("2. Appel du service de détection Google AI Gemini");
      const detectedInfo = await detectImageInfo(imagePreview, (step) => {
        addStep(step);
      });
      
      // Fermer le toast précédent manuellement en utilisant l'API retournée par toast()
      toastNotification.dismiss();
      
      addStep(`3. Informations détectées: couleur=${detectedInfo.color}, catégorie=${detectedInfo.category}`);
      console.log("Informations détectées:", detectedInfo);
      
      // Remplir tous les champs du formulaire avec les données détectées
      
      // 1. Définir la couleur détectée
      form.setValue('couleur', detectedInfo.color);
      
      // 2. Définir la catégorie détectée
      form.setValue('categorie', detectedInfo.category);
      
      // 3. Définir la description si elle est disponible
      if (detectedInfo.description) {
        form.setValue('description', detectedInfo.description);
        addStep(`4. Description détectée: ${detectedInfo.description}`);
      }
      
      // 4. Suggérer un nom basé sur la couleur et la catégorie
      const suggestedName = `${detectedInfo.color.charAt(0).toUpperCase() + detectedInfo.color.slice(1)} ${detectedInfo.category.toLowerCase()}`;
      form.setValue('nom', suggestedName);
      
      // 5. Pré-remplir la taille en fonction de la catégorie
      if (detectedInfo.category === "T-shirt" || detectedInfo.category === "Chemise" || detectedInfo.category === "Pull") {
        form.setValue('taille', 'M');
      } else if (detectedInfo.category === "Pantalon" || detectedInfo.category === "Jeans") {
        form.setValue('taille', '40');
      } else if (detectedInfo.category === "Chaussures") {
        form.setValue('taille', '42');
      } else {
        form.setValue('taille', 'M'); // Taille par défaut
      }
      
      // 6. Pré-remplir la marque si elle est détectée
      if (detectedInfo.brand) {
        form.setValue('marque', detectedInfo.brand);
        addStep(`5. Marque détectée: ${detectedInfo.brand}`);
      }
      
      addStep("6. Application des valeurs détectées au formulaire");
      toast({
        title: "Détection réussie",
        description: `Catégorie: ${detectedInfo.category}, Couleur: ${detectedInfo.color}`,
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
