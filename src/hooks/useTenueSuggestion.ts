
import { useState, useEffect } from 'react';
import { Vetement } from '@/services/vetement/types';
import { MeteoData } from '@/services/meteo/meteoService';
import { suggestVetements, generateOutfitMessage } from '@/services/meteo/tenue';

export const useTenueSuggestion = (meteo: MeteoData | null, vetements: Vetement[]) => {
  const [tenueSuggestion, setTenueSuggestion] = useState<{
    haut: Vetement | null,
    bas: Vetement | null,
    chaussures: Vetement | null,
    message: string
  } | null>(null);

  useEffect(() => {
    // Skip suggestion generation if meteo data or clothing items aren't available
    if (!meteo || vetements.length === 0) return;
    
    try {
      // Vérifier s'il pleut
      const isRaining = meteo.current.isRaining;
      console.log(`Conditions météo actuelles: ${isRaining ? 'Il pleut' : 'Pas de pluie'}`);
      
      // Générer une suggestion de tenue
      const suggestion = suggestVetements(vetements, meteo.current.temperature, isRaining);
      const message = generateOutfitMessage(meteo.current.temperature, meteo.current.description, isRaining);
      
      setTenueSuggestion({
        ...suggestion,
        message
      });
    } catch (err) {
      console.error('Erreur lors de la génération de la suggestion de tenue:', err);
    }
  }, [meteo, vetements]);

  return { tenueSuggestion };
};
