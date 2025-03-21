
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
    // Utilisation de l'API WeatherAPI.com (gratuite)
    const API_KEY = '9fbef9d1e1f74aebb8a143124242103'; // Clé gratuite pour WeatherAPI
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7&lang=fr&aqi=no`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données météo: ${response.status}`);
    }
    
    const data = await response.json();
    
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
        feelsLike: Math.round(data.current.feelslike_c)
      },
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        temperature: Math.round(day.day.avgtemp_c),
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        temperatureMin: Math.round(day.day.mintemp_c),
        temperatureMax: Math.round(day.day.maxtemp_c),
        humidity: day.day.avghumidity,
        windSpeed: Math.round(day.day.maxwind_kph)
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
