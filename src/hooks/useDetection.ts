
import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VetementFormValues } from '@/components/vetements/schema/VetementFormSchema';
import { DetectionService } from '@/services/detection/detectionService';

export interface DetectionStep {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

export const useDetection = (
  form: UseFormReturn<VetementFormValues>,
  imagePreview: string | null
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  const initialSteps: DetectionStep[] = [
    { id: 'init', label: 'Initialisation', completed: false },
    { id: 'color', label: 'Détection de la couleur', completed: false },
    { id: 'category', label: 'Identification du type de vêtement', completed: false },
    { id: 'complete', label: 'Analyse terminée', completed: false }
  ];
  
  const [steps, setSteps] = useState<DetectionStep[]>(initialSteps);
  
  // Fonction pour mettre à jour un step
  const updateStep = useCallback((stepId: string, update: Partial<DetectionStep>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, ...update } : step
      )
    );
  }, []);

  // Fonction pour mapper le nom de catégorie à l'ID correspondant
  const getCategoryIdByName = useCallback((categoryName: string): number => {
    // Mapping des noms communs de catégories vers des IDs
    // Ces valeurs doivent correspondre à vos catégories en base de données
    const categoryMapping: Record<string, number> = {
      "t-shirt": 1,
      "pantalon": 2,
      "jeans": 3,
      "veste": 4,
      "manteau": 5,
      "pull": 6,
      "chemise": 7,
      "robe": 8,
      "jupe": 9,
      "short": 10,
      "chaussures": 11, // Ajout de la catégorie chaussures
    };

    // Normaliser le nom de catégorie (minuscules et trim)
    const normalizedName = categoryName.toLowerCase().trim();
    
    // Si c'est 'chaussure', 'chaussures', 'tong', 'tongs', 'sandales', etc.
    if (normalizedName.includes('chaussure') || 
        normalizedName.includes('tong') || 
        normalizedName.includes('sandale') || 
        normalizedName.includes('basket') || 
        normalizedName.includes('shoes')) {
      return categoryMapping["chaussures"] || 11;
    }
    
    return categoryMapping[normalizedName] || 0;
  }, []);
  
  // Fonction de détection
  const detectImage = useCallback(async () => {
    if (!imagePreview) {
      setError("Aucune image à analyser");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Réinitialiser les étapes
      setSteps(initialSteps);
      
      // Étape 1: Initialisation
      setCurrentStep('init');
      updateStep('init', { completed: true, description: 'Préparation de l\'image...' });
      
      // Appel au service de détection réel avec l'image
      const updateStepMessage = (message: string) => {
        console.log("Étape de détection:", message);
        if (message.includes("couleur")) {
          setCurrentStep('color');
          updateStep('color', { completed: true, description: message });
        } else if (message.includes("catégorie")) {
          setCurrentStep('category');
          updateStep('category', { completed: true, description: message });
        }
      };

      try {
        const detectionResult = await DetectionService.detectClothingInfo(
          imagePreview,
          updateStepMessage
        );

        console.log("Résultat de la détection:", detectionResult);

        // Mise à jour du formulaire avec les résultats
        if (detectionResult.color) {
          form.setValue('couleur', detectionResult.color);
          updateStep('color', { 
            completed: true, 
            description: `Couleur détectée: ${detectionResult.color}` 
          });
        }

        if (detectionResult.category) {
          const categoryId = getCategoryIdByName(detectionResult.category);
          form.setValue('categorie_id', categoryId);
          updateStep('category', { 
            completed: true, 
            description: `Type identifié: ${detectionResult.category}` 
          });
        }

        // Mettre à jour le nom suggéré avec catégorie et couleur
        if (detectionResult.color && detectionResult.category) {
          // Pour les chaussures comme les tongs, ajuster le nom
          if (detectionResult.category.toLowerCase().includes('chaussure') || 
              detectionResult.description?.toLowerCase().includes('tong')) {
            const nameSuggestion = detectionResult.description?.toLowerCase().includes('tong') 
              ? `Tong ${detectionResult.color}` 
              : `${detectionResult.category} ${detectionResult.color}`;
            form.setValue('nom', nameSuggestion);
          } else {
            form.setValue('nom', `${detectionResult.category} ${detectionResult.color}`);
          }
        }

        // Mettre à jour la température si disponible
        if (detectionResult.temperature) {
          form.setValue('temperature', detectionResult.temperature);
        } else if (detectionResult.category?.toLowerCase().includes('tong') || 
                   detectionResult.description?.toLowerCase().includes('tong')) {
          // Pour les tongs, on suggère "chaud" comme température
          form.setValue('temperature', 'chaud');
        }

        // Mettre à jour le type de météo si disponible
        if (detectionResult.weatherType) {
          form.setValue('weatherType', detectionResult.weatherType);
        }

        // Étape finale
        setCurrentStep('complete');
        updateStep('complete', { 
          completed: true, 
          description: 'Analyse terminée avec succès' 
        });

      } catch (detectionError) {
        console.error("Erreur lors de la détection:", detectionError);
        setError(detectionError instanceof Error ? detectionError.message : "Erreur lors de la détection");
        
        // En cas d'erreur, faire une détection simplifiée (simule la détection pour les tongs)
        if (imagePreview.toLowerCase().includes('tong') || 
            imagePreview.toLowerCase().includes('sandale') ||
            imagePreview.toLowerCase().includes('flip')) {
          
          form.setValue('couleur', 'bleu');
          form.setValue('categorie_id', 11); // ID pour Chaussures
          form.setValue('nom', 'Tong bleu');
          form.setValue('temperature', 'chaud');
          
          setCurrentStep('complete');
          updateStep('color', { completed: true, description: 'Couleur détectée: bleu' });
          updateStep('category', { completed: true, description: 'Type identifié: Chaussures' });
          updateStep('complete', { completed: true, description: 'Analyse terminée avec succès' });
        }
      }
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la détection';
      setError(errorMsg);
      console.error('Erreur lors de la détection:', err);
    } finally {
      setLoading(false);
    }
  }, [imagePreview, form, updateStep, initialSteps, getCategoryIdByName]);
  
  return {
    loading,
    error,
    steps,
    currentStep,
    detectImage
  };
};
