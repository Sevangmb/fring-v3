
import { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VetementFormValues } from '@/components/vetements/schema/VetementFormSchema';

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
      
      // Simuler un appel API à Supabase Edge Function (à remplacer par votre vrai appel)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Étape 2: Détection de la couleur
      setCurrentStep('color');
      updateStep('color', { completed: true, description: 'Couleur détectée: noir' });
      
      // Simuler une détection de couleur (à remplacer par votre vrai appel)
      form.setValue('couleur', 'noir');
      
      // Simuler un léger délai avant la prochaine étape
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Étape 3: Identification du type de vêtement
      setCurrentStep('category');
      updateStep('category', { completed: true, description: 'Type identifié: Veste' });
      
      // Attribuer une catégorie (1 = T-shirt, 2 = Pantalon, etc. - à adapter selon votre base de données)
      form.setValue('categorie_id', 4); // Supposons 4 = Veste
      
      // Étape 4: Finalisation
      setCurrentStep('complete');
      updateStep('complete', { completed: true, description: 'Analyse terminée avec succès' });
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la détection';
      setError(errorMsg);
      console.error('Erreur lors de la détection:', err);
    } finally {
      setLoading(false);
    }
  }, [imagePreview, form, updateStep, initialSteps]);
  
  return {
    loading,
    error,
    steps,
    currentStep,
    detectImage
  };
};
