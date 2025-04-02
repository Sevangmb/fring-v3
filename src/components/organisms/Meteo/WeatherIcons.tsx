
import React from 'react';
import { Sun, Cloud, CloudRain, CloudFog, CloudSnow, CloudLightning, Wind } from 'lucide-react';

export type WeatherIconType = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'foggy' 
  | 'snowy' 
  | 'thunder' 
  | 'windy' 
  | 'default';

interface WeatherIconProps {
  type: WeatherIconType;
  className?: string;
  size?: number;
}

/**
 * Composant qui affiche une icône météo basée sur le type de temps
 */
const WeatherIcon: React.FC<WeatherIconProps> = ({ type, className = "", size = 24 }) => {
  // Sélectionner l'icône appropriée selon le type de temps
  switch (type) {
    case 'sunny':
      return <Sun size={size} className={className} />;
    case 'cloudy':
      return <Cloud size={size} className={className} />;
    case 'rainy':
      return <CloudRain size={size} className={className} />;
    case 'foggy':
      return <CloudFog size={size} className={className} />;
    case 'snowy':
      return <CloudSnow size={size} className={className} />;
    case 'thunder':
      return <CloudLightning size={size} className={className} />;
    case 'windy':
      return <Wind size={size} className={className} />;
    case 'default':
    default:
      // Utiliser l'image importée comme fallback
      return (
        <img 
          src="/lovable-uploads/375c0bdb-76f7-4e16-ad2e-eeef3e06e5c9.png" 
          alt="Météo" 
          width={size} 
          height={size} 
          className={className}
        />
      );
  }
};

/**
 * Détermine le type d'icône météo à partir d'une description
 */
export const getWeatherIconType = (description: string): WeatherIconType => {
  const desc = description.toLowerCase();
  
  if (desc.includes('soleil') || desc.includes('ensoleillé') || desc.includes('clair')) {
    return 'sunny';
  } else if (desc.includes('nuage') || desc.includes('couvert') || desc.includes('nuageux')) {
    return 'cloudy';
  } else if (desc.includes('pluie') || desc.includes('averse') || desc.includes('pluvieux')) {
    return 'rainy';
  } else if (desc.includes('brouillard') || desc.includes('brume')) {
    return 'foggy';
  } else if (desc.includes('neige') || desc.includes('neigeux')) {
    return 'snowy';
  } else if (desc.includes('orage') || desc.includes('tonner') || desc.includes('éclair')) {
    return 'thunder';
  } else if (desc.includes('vent') || desc.includes('venteux')) {
    return 'windy';
  }
  
  return 'default';
};

export default WeatherIcon;
