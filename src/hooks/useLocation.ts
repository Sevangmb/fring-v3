
import { useState, useEffect } from 'react';
import { getUserLocation } from '@/services/meteo/meteoService';

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLocationLoading(true);
        setLocationError(null);
        
        const coordinates = await getUserLocation();
        console.log(`Localisation récupérée: ${coordinates.latitude}, ${coordinates.longitude}`);
        
        setLocation(coordinates);
      } catch (err) {
        console.error('Erreur lors de la récupération de la localisation:', err);
        const errorMessage = err instanceof Error ? err.message : 'Impossible de récupérer la localisation';
        setLocationError(errorMessage);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, locationLoading, locationError };
};
