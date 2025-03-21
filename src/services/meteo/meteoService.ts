
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
  };
  forecast: PrevisionJour[];
}

/**
 * Récupère les données météo pour les 7 prochains jours
 * @param latitude - Latitude pour la localisation
 * @param longitude - Longitude pour la localisation
 * @returns Les données météo actuelles et prévisions
 */
export const fetchMeteoData = async (latitude: number, longitude: number): Promise<MeteoData> => {
  try {
    // Utilisation de l'API OpenWeatherMap
    const API_KEY = 'f5bd7a7cb0f68b28e437e650f40d2a82'; // Clé publique pour démo
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&lang=fr&appid=${API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données météo: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Formater les données pour notre application
    const meteoData: MeteoData = {
      city: data.timezone.split('/')[1]?.replace('_', ' ') || 'Ville inconnue',
      country: 'France', // Par défaut, à améliorer avec geocoding inverse
      current: {
        temperature: Math.round(data.current.temp),
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_speed * 3.6), // Conversion en km/h
        feelsLike: Math.round(data.current.feels_like)
      },
      forecast: data.daily.slice(0, 7).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        temperature: Math.round(day.temp.day),
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        temperatureMin: Math.round(day.temp.min),
        temperatureMax: Math.round(day.temp.max),
        humidity: day.humidity,
        windSpeed: Math.round(day.wind_speed * 3.6) // Conversion en km/h
      }))
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
