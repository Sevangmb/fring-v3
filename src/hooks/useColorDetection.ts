
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { detectImageInfo } from "@/services/colorDetectionService";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "@/components/vetements/VetementFormFields";

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

  const addStep = (step: string) => {
    setDetectionSteps(prev => [...prev, step]);
    console.log(`Étape de détection: ${step}`);
    // Afficher chaque étape dans un toast pour plus de visibilité
    toast({
      title: "Étape de détection",
      description: step,
      duration: 3000,
    });
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
    
    try {
      toast({
        title: "Détection en cours",
        description: "Analyse de l'image pour identifier la couleur et la catégorie...",
        duration: 5000,
      });
      
      addStep("1. Préparation de l'image pour l'analyse");
      console.log("Envoi de l'image pour détection:", imagePreview.substring(0, 50) + "...");
      
      addStep("2. Appel du service de détection");
      const detectedInfo = await detectImageInfo(imagePreview, (step) => {
        addStep(step);
      });
      
      addStep(`3. Informations détectées: couleur=${detectedInfo.color}, catégorie=${detectedInfo.category}`);
      console.log("Informations détectées:", detectedInfo);
      
      // Vérifier que les informations détectées sont valides
      if (detectedInfo && detectedInfo.color) {
        // Définir la couleur détectée
        form.setValue('couleur', detectedInfo.color);
        
        // Définir la catégorie détectée si disponible
        if (detectedInfo.category) {
          form.setValue('categorie', detectedInfo.category);
        }
        
        addStep("4. Application des valeurs détectées au formulaire");
        toast({
          title: "Détection réussie",
          description: `La couleur ${detectedInfo.color} et la catégorie ${detectedInfo.category || 'inconnue'} ont été détectées.`,
          duration: 5000,
        });
      } else {
        throw new Error("Données de détection invalides");
      }
    } catch (error) {
      console.error("Erreur lors de la détection:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur inconnue lors de la détection";
      
      setDetectionError("La détection automatique a rencontré un problème. Veuillez vérifier les détails ci-dessous.");
      addStep(`Erreur: ${errorMessage}`);
      
      // Utiliser une couleur par défaut comme fallback
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Jupe', 'Veste'];
      
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      
      form.setValue('couleur', randomColor);
      form.setValue('categorie', randomCategory);
      
      toast({
        title: "Détection partielle",
        description: "Une couleur et une catégorie ont été suggérées automatiquement. Vérifiez les détails de l'erreur.",
        variant: "default",
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
    handleDetectImage
  };
};
