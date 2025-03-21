
import { useState, useEffect } from 'react';
import { fetchMeteoData, MeteoData } from '@/services/meteo/meteoService';

export const useWeatherData = (latitude?: number, longitude?: number) => {
  const [meteo, setMeteo] = useState<MeteoData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Skip fetching if coordinates aren't available yet
      if (!latitude || !longitude) return;
      
      try {
        setWeatherLoading(true);
        setWeatherError(null);
        
        // Récupérer les données météo
        const data = await fetchMeteoData(latitude, longitude);
        console.log('Données météo récupérées avec succès');
        setMeteo(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la météo:', err);
        const errorMessage = err instanceof Error ? err.message : 'Impossible de charger les données météo';
        setWeatherError(errorMessage);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { meteo, weatherLoading, weatherError };
};
