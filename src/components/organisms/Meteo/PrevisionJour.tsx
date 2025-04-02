
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/Typography';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PrevisionJourProps {
  date: string;
  temperature: number;
  description: string;
  icon: string;
  temperatureMin: number;
  temperatureMax: number;
}

const PrevisionJour: React.FC<PrevisionJourProps> = ({
  date,
  temperature,
  description,
  icon,
  temperatureMin,
  temperatureMax,
}) => {
  let formattedDate = "";
  let isToday = false;
  
  try {
    const dateObj = parseISO(date);
    const today = new Date();
    
    isToday = 
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();
    
    formattedDate = format(dateObj, 'EEE d', { locale: fr });
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } catch (e) {
    console.error('Erreur de parsing de date:', e);
    formattedDate = date;
  }
  
  // Fonction pour formater correctement l'URL de l'icône
  const formatIconUrl = (iconCode: string) => {
    // Si l'URL est déjà complète ou contient '//'
    if (iconCode.startsWith('http') || iconCode.startsWith('//')) {
      // S'assurer que les URLs relatives commençant par '//' ont le protocole 'https:'
      return iconCode.startsWith('//') ? `https:${iconCode}` : iconCode;
    }
    // Sinon utiliser l'URL de l'API OpenWeatherMap
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  return (
    <Card className={`p-3 flex flex-col items-center h-full ${isToday ? 'border-primary bg-primary/5' : ''}`}>
      <Text className="font-medium" title={isToday ? "Aujourd'hui" : ""}>
        {isToday ? "Aujourd'hui" : formattedDate}
      </Text>
      
      <img 
        src={formatIconUrl(icon)} 
        alt={description}
        className="w-14 h-14 my-2"
        onError={(e) => {
          console.error(`Erreur de chargement d'icône météo:`, icon);
          // Fallback vers une icône par défaut
          const target = e.target as HTMLImageElement;
          target.src = "/lovable-uploads/375c0bdb-76f7-4e16-ad2e-eeef3e06e5c9.png";
          target.className = "w-14 h-14";
        }}
      />
      
      <Text className="text-center text-sm capitalize mb-1" title={description}>
        {description.length > 12 ? `${description.substring(0, 12)}...` : description}
      </Text>
      
      <Text as="span" variant="h4" weight="bold" className="my-1">
        {temperature}°
      </Text>
      
      <div className="flex justify-between w-full mt-1">
        <div className="flex items-center" title="Température minimale">
          <ChevronDown className="h-3 w-3 text-blue-500" />
          <Text className="text-xs ml-1">{temperatureMin}°</Text>
        </div>
        <div className="flex items-center" title="Température maximale">
          <ChevronUp className="h-3 w-3 text-red-500" />
          <Text className="text-xs ml-1">{temperatureMax}°</Text>
        </div>
      </div>
    </Card>
  );
};

export default PrevisionJour;
