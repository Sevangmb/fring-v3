
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenueService';
import TenueHeader from './TenueSuggestion/TenueHeader';
import TenuePreviews from './TenueSuggestion/TenuePreviews';
import TenueDetails from './TenueSuggestion/TenueDetails';

interface TenueSuggestionProps {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
  message: string;
}

const TenueSuggestion: React.FC<TenueSuggestionProps> = ({
  haut,
  bas,
  chaussures,
  message
}) => {
  const isRainyWeather = message.toLowerCase().includes('pleut');
  
  return (
    <Card className="p-4 bg-gradient-to-br from-theme-teal-light to-white/80 dark:from-theme-teal-dark/20 dark:to-theme-teal-dark/10 border-theme-teal-medium/30 dark:border-theme-teal-medium/20">
      <TenueHeader isRainyWeather={isRainyWeather} message={message} />
      
      {/* Affichage principal de la tenue avec images */}
      <TenuePreviews haut={haut} bas={bas} chaussures={chaussures} />
      
      {/* Détails des vêtements */}
      <TenueDetails haut={haut} bas={bas} chaussures={chaussures} />
    </Card>
  );
};

export default TenueSuggestion;
