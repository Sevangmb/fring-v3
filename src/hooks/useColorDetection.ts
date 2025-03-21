
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

  const handleDetectImage = async () => {
    if (!imagePreview) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord télécharger une image à analyser.",
        variant: "destructive",
      });
      return;
    }

    setDetectionError(null);
    setDetectingColor(true);
    
    try {
      toast({
        title: "Détection en cours",
        description: "Analyse de l'image pour identifier la couleur et la catégorie...",
      });
      
      console.log("Envoi de l'image pour détection:", imagePreview.substring(0, 50) + "...");
      const detectedInfo = await detectImageInfo(imagePreview);
      
      console.log("Informations détectées:", detectedInfo);
      
      // Définir la couleur détectée
      form.setValue('couleur', detectedInfo.color);
      
      // Définir la catégorie détectée si disponible
      if (detectedInfo.category) {
        form.setValue('categorie', detectedInfo.category);
      }
      
      toast({
        title: "Détection réussie",
        description: `La couleur ${detectedInfo.color} et la catégorie ${detectedInfo.category} ont été détectées.`,
      });
    } catch (error) {
      console.error("Erreur lors de la détection:", error);
      setDetectionError("La détection automatique a échoué. Veuillez sélectionner manuellement les informations.");
      
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      form.setValue('couleur', randomColor);
      
      toast({
        title: "Détection échouée",
        description: "La détection automatique a rencontré un problème. Vous pouvez sélectionner manuellement la couleur.",
        variant: "destructive",
      });
    } finally {
      setDetectingColor(false);
    }
  };

  return {
    detectingColor,
    setDetectingColor,
    detectionError,
    handleDetectImage
  };
};
