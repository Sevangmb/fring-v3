
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudLightning, 
  CloudFog,
  Droplets,
  Wind
} from "lucide-react";
import { Text } from "@/components/atoms/Typography";

interface MeteoActuelleProps {
  temperature: number;
  description: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  city: string;
}

const getWeatherIcon = (iconCode: string) => {
  // Mapper les codes d'icônes OpenWeatherMap aux composants Lucide
  switch (iconCode.substring(0, 2)) {
    case '01': return <Sun className="h-10 w-10 text-yellow-500" />;
    case '02': return <Sun className="h-10 w-10 text-yellow-500" />;
    case '03': case '04': return <Cloud className="h-10 w-10 text-gray-500" />;
    case '09': return <CloudDrizzle className="h-10 w-10 text-blue-500" />;
    case '10': return <CloudRain className="h-10 w-10 text-blue-600" />;
    case '11': return <CloudLightning className="h-10 w-10 text-purple-500" />;
    case '13': return <CloudSnow className="h-10 w-10 text-blue-200" />;
    case '50': return <CloudFog className="h-10 w-10 text-gray-400" />;
    default: return <Sun className="h-10 w-10 text-yellow-500" />;
  }
};

const MeteoActuelle: React.FC<MeteoActuelleProps> = ({
  temperature,
  description,
  icon,
  feelsLike,
  humidity,
  windSpeed,
  city
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">
          Météo à {city}
        </CardTitle>
        {getWeatherIcon(icon)}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <Text variant="h2" className="text-4xl font-bold">{temperature}°C</Text>
            <Text className="ml-2 text-muted-foreground">• Ressenti {feelsLike}°C</Text>
          </div>
          <Text variant="lead" className="mt-1 capitalize">{description}</Text>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-blue-500" />
              <Text className="text-sm">Humidité: {humidity}%</Text>
            </div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              <Text className="text-sm">Vent: {windSpeed} km/h</Text>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeteoActuelle;
