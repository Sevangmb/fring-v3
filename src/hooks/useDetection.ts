
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface DetectionResults {
  temperature?: string;
  weather_type?: string;
  [key: string]: any;
}

export interface DetectionStep {
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export const useDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState<DetectionResults>({});
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<DetectionStep[]>([
    { label: 'Analyse de l\'image', status: 'pending' },
    { label: 'Détection des attributs', status: 'pending' }
  ]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const { toast } = useToast();

  const simulateDetection = async (imageFile: File): Promise<DetectionResults> => {
    return new Promise((resolve) => {
      // Simulation de détection avec délai aléatoire
      const detectionTime = Math.random() * 1000 + 500; // entre 500ms et 1500ms
      
      setTimeout(() => {
        // Données simulées avec probabilités variables
        const temperatures = ['froid', 'tempere', 'chaud'];
        const weatherTypes = ['normal', 'pluie', 'neige'];
        
        // Choix aléatoire avec plus de chances pour des valeurs "normales"
        const temperatureIndex = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 1; // 70% tempere
        const weatherTypeIndex = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0; // 70% normal
        
        const detectedResults = {
          temperature: temperatures[temperatureIndex],
          weather_type: weatherTypes[weatherTypeIndex],
        };
        
        resolve(detectedResults);
      }, detectionTime);
    });
  };

  const detectAttributesFromImage = async (imageFile: File) => {
    if (!imageFile) {
      toast({
        title: "Erreur",
        description: "Aucune image à analyser",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);
    setError(null);
    setCurrentStep(0);
    updateStepStatus(0, 'processing');
    
    try {
      // Étape 1: Analyse de l'image
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStepStatus(0, 'complete');
      setCurrentStep(1);
      updateStepStatus(1, 'processing');
      
      // Étape 2: Détection des attributs
      // Remplacer par un appel API réel dans une version future
      const detectedAttributes = await simulateDetection(imageFile);
      updateStepStatus(1, 'complete');
      
      // Mettre à jour les résultats
      setResults(detectedAttributes);
      
      toast({
        title: "Analyse terminée",
        description: "Les attributs du vêtement ont été détectés",
      });
      
      return detectedAttributes;
    } catch (error) {
      console.error("Erreur lors de la détection:", error);
      setError("Impossible d'analyser l'image");
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'image",
        variant: "destructive",
      });
      
      // Marquer l'étape actuelle comme en erreur
      if (currentStep !== null) {
        updateStepStatus(currentStep, 'error');
      }
      
      return null;
    } finally {
      setIsDetecting(false);
    }
  };

  // Fonction pour mettre à jour le statut d'une étape
  const updateStepStatus = (stepIndex: number, status: DetectionStep['status']) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      if (newSteps[stepIndex]) {
        newSteps[stepIndex] = { ...newSteps[stepIndex], status };
      }
      return newSteps;
    });
  };

  // Fonction pour appliquer les résultats de détection au formulaire
  const applyDetectionResults = (form: any, results: DetectionResults) => {
    if (!results || Object.keys(results).length === 0) return;
    
    // Pour chaque attribut détecté, mettre à jour le formulaire
    Object.entries(results).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        try {
          form.setValue(key, value);
        } catch (error) {
          console.error(`Erreur lors de l'application de la valeur pour ${key}:`, error);
        }
      }
    });
  };

  // Fonction pour déclencher la détection d'image
  const detectImage = async (imageFile: File) => {
    const results = await detectAttributesFromImage(imageFile);
    return results;
  };

  return {
    isDetecting,
    results,
    detectAttributesFromImage,
    applyDetectionResults,
    error,
    steps,
    currentStep,
    detectImage
  };
};
