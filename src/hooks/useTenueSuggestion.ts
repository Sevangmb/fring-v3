
import { useState, useEffect, useCallback } from 'react';
import { Vetement } from '@/services/vetement/types';
import { MeteoData } from '@/services/meteo/meteoService';
import { suggestVetements, generateOutfitMessage } from '@/services/meteo/tenue';
import { useToast } from '@/hooks/use-toast';

export const useTenueSuggestion = (meteo: MeteoData | null, vetements: Vetement[]) => {
  const [tenueSuggestion, setTenueSuggestion] = useState<{
    haut: Vetement | null,
    bas: Vetement | null,
    chaussures: Vetement | null,
    message: string
  } | null>(null);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Fonction pour générer une suggestion
  const generateSuggestion = useCallback(async () => {
    // Skip suggestion generation if meteo data or clothing items aren't available
    if (!meteo || vetements.length === 0) return;
    
    try {
      setIsGenerating(true);
      
      // Vérifier s'il pleut
      const isRaining = meteo.current.isRaining;
      console.log(`Conditions météo actuelles: ${isRaining ? 'Il pleut' : 'Pas de pluie'}`);
      
      // Générer une suggestion de tenue
      const suggestion = await suggestVetements(vetements, meteo.current.temperature, isRaining);
      const message = generateOutfitMessage(meteo.current.temperature, meteo.current.description, isRaining);
      
      setTenueSuggestion({
        ...suggestion,
        message
      });
    } catch (err) {
      console.error('Erreur lors de la génération de la suggestion de tenue:', err);
      toast({
        title: "Erreur",
        description: "Impossible de générer une suggestion de tenue",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [meteo, vetements, toast]);

  // Générer une suggestion quand les données météo ou les vêtements changent
  useEffect(() => {
    generateSuggestion();
  }, [generateSuggestion]);

  return { 
    tenueSuggestion,
    isGenerating,
    regenerateSuggestion: generateSuggestion 
  };
};
