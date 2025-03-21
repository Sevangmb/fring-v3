
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Umbrella } from 'lucide-react';

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
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 py-1 px-2 rounded-full">
            <Umbrella size={16} />
            <span className="text-xs font-medium">Temps pluvieux</span>
          </div>
        )}
      </div>
      
      <Text className="mb-4">{message}</Text>
    </>
  );
};

export default TenueHeader;
