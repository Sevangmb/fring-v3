
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface DetectionResults {
  temperature?: string;
  weather_type?: string;
  [key: string]: any;
}

export const useDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState<DetectionResults>({});
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
    
    try {
      // Remplacer par un appel API réel dans une version future
      const detectedAttributes = await simulateDetection(imageFile);
      
      // Mettre à jour les résultats
      setResults(detectedAttributes);
      
      toast({
        title: "Analyse terminée",
        description: "Les attributs du vêtement ont été détectés",
      });
      
      return detectedAttributes;
    } catch (error) {
      console.error("Erreur lors de la détection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser l'image",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsDetecting(false);
    }
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

  return {
    isDetecting,
    results,
    detectAttributesFromImage,
    applyDetectionResults,
  };
};
