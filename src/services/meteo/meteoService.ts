
import { supabase } from '@/lib/supabase';

export interface PrevisionJour {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  temperatureMin: number;
  temperatureMax: number;
  humidity: number;
  windSpeed: number;
  isRaining: boolean;
  precipitationChance: number;
}

export interface MeteoData {
  city: string;
  country: string;
  current: {
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    isRaining: boolean;
    precipitationChance: number;
  };
  forecast: PrevisionJour[];
}

/**
 * Vérifie si la description météo indique de la pluie
 * @param description Description météo
 * @param conditionCode Code de condition météo (si disponible)
 * @returns Vrai si la description indique de la pluie
 */
export const isRainDescription = (description: string, conditionCode?: number): boolean => {
  const lowerDesc = description.toLowerCase();
  
  // Termes français indiquant de la pluie
  const rainTerms = [
    'pluie', 'pluvieux', 'averse', 'précipitation', 'bruine', 
    'crachin', 'ondée', 'déluge', 'mouillé'
  ];
  
  // Vérifier les codes de condition WeatherAPI pour la pluie (1063 à 1201)
  if (conditionCode) {
    if ((conditionCode >= 1063 && conditionCode <= 1201) || 
        (conditionCode >= 1240 && conditionCode <= 1246)) {
      return true;
    }
  }
  
  // Vérifier si la description contient des termes liés à la pluie
  return rainTerms.some(term => lowerDesc.includes(term));
};

/**
 * Récupère les données météo pour les 3 prochains jours
 * @param latitude - Latitude pour la localisation
 * @param longitude - Longitude pour la localisation
 * @returns Les données météo actuelles et prévisions
 */
export const fetchMeteoData = async (latitude: number, longitude: number): Promise<MeteoData> => {
  try {
    // Utilisation de l'API WeatherAPI.com (gratuite)
    const API_KEY = 'ee37daadb75b4dd79e0165525252103'; // Clé fournie par l'utilisateur
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3&lang=fr&aqi=no`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données météo: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Vérifier s'il pleut actuellement
    const currentConditionCode = data.current.condition.code;
    const currentDesc = data.current.condition.text;
    const isCurrentlyRaining = isRainDescription(currentDesc, currentConditionCode) || 
                              data.current.precip_mm > 0;
    
    // Formater les données depuis WeatherAPI pour notre application
    const meteoData: MeteoData = {
      city: data.location.name,
      country: data.location.country,
      current: {
        temperature: Math.round(data.current.temp_c),
        description: data.current.condition.text,
        icon: data.current.condition.icon,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        feelsLike: Math.round(data.current.feelslike_c),
        isRaining: isCurrentlyRaining,
        precipitationChance: data.forecast.forecastday[0].day.daily_chance_of_rain
      },
      forecast: data.forecast.forecastday.map((day: any) => {
        const dayConditionCode = day.day.condition.code;
        const dayDesc = day.day.condition.text;
        const isDayRaining = isRainDescription(dayDesc, dayConditionCode) || 
                            day.day.totalprecip_mm > 0;
        
        return {
          date: day.date,
          temperature: Math.round(day.day.avgtemp_c),
          description: day.day.condition.text,
          icon: day.day.condition.icon,
          temperatureMin: Math.round(day.day.mintemp_c),
          temperatureMax: Math.round(day.day.maxtemp_c),
          humidity: day.day.avghumidity,
          windSpeed: Math.round(day.day.maxwind_kph),
          isRaining: isDayRaining,
          precipitationChance: day.day.daily_chance_of_rain
        };
      })
    };
    
    return meteoData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo:', error);
    throw error;
  }
};

/**
 * Récupère la géolocalisation de l'utilisateur
 * @returns Promise avec latitude et longitude
 */
export const getUserLocation = (): Promise<{latitude: number, longitude: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      // Coordonnées par défaut pour Paris si la géolocalisation n'est pas disponible
      resolve({ latitude: 48.8566, longitude: 2.3522 });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Erreur de géolocalisation:', error);
        // Coordonnées par défaut pour Paris en cas d'erreur
        resolve({ latitude: 48.8566, longitude: 2.3522 });
      }
    );
  });
};
