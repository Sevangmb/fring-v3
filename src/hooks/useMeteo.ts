
import { useState, useEffect } from 'react';
import { fetchMeteoData, getUserLocation, MeteoData } from '@/services/meteo/meteoService';

export const useMeteo = () => {
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMeteoData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer la localisation de l'utilisateur
        const { latitude, longitude } = await getUserLocation();
        
        // Récupérer les données météo
        const data = await fetchMeteoData(latitude, longitude);
        setMeteo(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la météo:', err);
        setError('Impossible de charger les données météo');
      } finally {
        setLoading(false);
      }
    };

    getMeteoData();
  }, []);

  return { meteo, loading, error };
};
