
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Card } from '@/components/ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';

interface MeteoActuelleProps {
  temperature: number;
  description: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  city: string;
}

const MeteoActuelle: React.FC<MeteoActuelleProps> = ({
  temperature,
  description,
  icon,
  feelsLike,
  humidity,
  windSpeed,
  city,
}) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-100 dark:border-blue-800">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center mr-auto">
          <img 
            src={icon.startsWith('//') ? `https:${icon}` : icon} 
            alt={description}
            className="w-20 h-20 object-contain" 
          />
          <div className="ml-2">
            <Text as="h3" variant="h3" weight="bold">{city}</Text>
            <Text variant="lead" className="capitalize">{description}</Text>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <div className="flex items-center">
            <Text as="span" variant="h2" weight="bold" className="text-5xl">{temperature}°</Text>
            <Text as="span" variant="h5" className="ml-2 text-muted-foreground">
              Ressenti {feelsLike}°
            </Text>
          </div>
          
          <div className="flex gap-4 mt-2">
            <div className="flex items-center" title="Humidité">
              <Droplets className="h-4 w-4 text-blue-500 mr-1" />
              <Text className="text-sm">{humidity}%</Text>
            </div>
            <div className="flex items-center" title="Vitesse du vent">
              <Wind className="h-4 w-4 text-blue-500 mr-1" />
              <Text className="text-sm">{windSpeed} km/h</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MeteoActuelle;
