
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Umbrella } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TenueHeaderProps {
  isRainyWeather: boolean;
  message: string;
}

const TenueHeader: React.FC<TenueHeaderProps> = ({ isRainyWeather, message }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Text as="h3" variant="h4">Suggestion de tenue</Text>
        {isRainyWeather && (
          <Badge variant="outline" className="flex items-center gap-1 text-theme-teal-dark dark:text-theme-teal-medium bg-theme-teal-light dark:bg-theme-teal-dark/30 py-1 px-2 rounded-full border-theme-teal-medium/50">
            <Umbrella size={16} />
            <span className="text-xs font-medium">Temps pluvieux</span>
          </Badge>
        )}
      </div>
      
      <Text className="mb-4">{message}</Text>
    </>
  );
};

export default TenueHeader;
