
import { useLocation } from './useLocation';
import { useWeatherData } from './useWeatherData';
import { useVetements } from './useVetements';
import { useTenueSuggestion } from './useTenueSuggestion';

export const useMeteo = () => {
  // Get user location
  const { location, locationLoading, locationError } = useLocation();
  
  // Fetch weather data based on location
  const { meteo, weatherLoading, weatherError } = useWeatherData(
    location?.latitude,
    location?.longitude
  );
  
  // Fetch user's clothing items
  const { vetements, vetementsLoading, vetementsError } = useVetements();
  
  // Generate outfit suggestion based on weather and available clothing
  const { tenueSuggestion, isGenerating: isGeneratingSuggestion, regenerateSuggestion } = useTenueSuggestion(meteo, vetements);
  
  // Combine loading states
  const loading = locationLoading || weatherLoading || vetementsLoading;
  
  // Prioritize weather errors over location errors
  const error = weatherError || locationError || vetementsError;

  return { 
    meteo, 
    loading, 
    error, 
    tenueSuggestion,
    isGeneratingSuggestion,
    regenerateSuggestion
  };
};
