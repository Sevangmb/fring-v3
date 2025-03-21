
import { useState, useEffect } from 'react';
import { fetchMeteoData, getUserLocation, MeteoData } from '@/services/meteo/meteoService';
import { fetchVetements, Vetement } from '@/services/vetement';
import { suggestVetements, generateOutfitMessage } from '@/services/meteo/tenueService';

export const useMeteo = () => {
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [tenueSuggestion, setTenueSuggestion] = useState<{
    haut: Vetement | null,
    bas: Vetement | null,
    chaussures: Vetement | null,
    message: string
  } | null>(null);

  useEffect(() => {
    const getMeteoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer la localisation de l'utilisateur
        const { latitude, longitude } = await getUserLocation();
        console.log(`Localisation récupérée: ${latitude}, ${longitude}`);
        
        // Récupérer les données météo
        const data = await fetchMeteoData(latitude, longitude);
        console.log('Données météo récupérées avec succès');
        setMeteo(data);
        
        // Récupérer les vêtements de l'utilisateur
        try {
          const vetementsData = await fetchVetements();
          setVetements(vetementsData);
          
          // Générer une suggestion de tenue
          if (data && vetementsData.length > 0) {
            const suggestion = suggestVetements(vetementsData, data.current.temperature);
            const message = generateOutfitMessage(data.current.temperature, data.current.description);
            setTenueSuggestion({
              ...suggestion,
              message
            });
          }
        } catch (vetementsError) {
          console.warn('Impossible de récupérer les vêtements:', vetementsError);
          // Ne pas définir d'erreur globale, on affiche juste la météo sans suggestion
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la météo:', err);
        const errorMessage = err instanceof Error ? err.message : 'Impossible de charger les données météo';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getMeteoData();
  }, []);

  return { meteo, loading, error, tenueSuggestion };
};
