
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
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
      <TenueHeader isRainyWeather={isRainyWeather} message={message} />
      
      {/* Affichage principal de la tenue avec images */}
      <TenuePreviews haut={haut} bas={bas} chaussures={chaussures} />
      
      {/* Détails des vêtements */}
      <TenueDetails haut={haut} bas={bas} chaussures={chaussures} />
    </Card>
  );
};

export default TenueSuggestion;
