
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { Text } from '@/components/atoms/Typography';
import { useIsMobile } from '@/hooks/use-mobile';

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
  city
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden border-theme-teal-medium/30 dark:border-theme-teal-medium/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              <img 
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="w-16 h-16 -ml-4 -mt-2"
              />
              <div>
                <Text variant="h3" className="text-primary">
                  {city}
                </Text>
                <Text className="text-muted-foreground capitalize">
                  {description}
                </Text>
              </div>
            </div>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Text variant="h1" className="text-4xl md:text-5xl font-bold mr-4">
              {Math.round(temperature)}°
            </Text>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-primary mr-2" />
                <Text className="text-sm">
                  {isMobile ? "" : "Ressenti "}
                  {Math.round(feelsLike)}°
                </Text>
              </div>
              
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-primary mr-2" />
                <Text className="text-sm">
                  {humidity}%
                </Text>
              </div>
              
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-primary mr-2" />
                <Text className="text-sm">
                  {windSpeed} km/h
                </Text>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeteoActuelle;
