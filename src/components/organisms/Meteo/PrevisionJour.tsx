
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudLightning, 
  CloudFog 
} from "lucide-react";
import { Text } from "@/components/atoms/Typography";

interface PrevisionJourProps {
  date: string;
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
  description: string;
  icon: string;
}

const getWeatherIcon = (iconCode: string) => {
  // Mapper les codes d'icônes OpenWeatherMap aux composants Lucide
  switch (iconCode.substring(0, 2)) {
    case '01': return <Sun className="h-5 w-5 text-yellow-500" />;
    case '02': return <Sun className="h-5 w-5 text-yellow-500" />;
    case '03': case '04': return <Cloud className="h-5 w-5 text-gray-500" />;
    case '09': return <CloudDrizzle className="h-5 w-5 text-blue-500" />;
    case '10': return <CloudRain className="h-5 w-5 text-blue-600" />;
    case '11': return <CloudLightning className="h-5 w-5 text-purple-500" />;
    case '13': return <CloudSnow className="h-5 w-5 text-blue-200" />;
    case '50': return <CloudFog className="h-5 w-5 text-gray-400" />;
    default: return <Sun className="h-5 w-5 text-yellow-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const PrevisionJour: React.FC<PrevisionJourProps> = ({
  date,
  temperature,
  temperatureMin,
  temperatureMax,
  description,
  icon
}) => {
  const formattedDate = formatDate(date);
  const isToday = new Date(date).toDateString() === new Date().toDateString();

  return (
    <Card className={`w-full ${isToday ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardContent className="p-3">
        <div className="flex flex-col items-center">
          <Text variant="subtle" className="text-xs font-medium">
            {isToday ? "Aujourd'hui" : formattedDate}
          </Text>
          <div className="my-2">{getWeatherIcon(icon)}</div>
          <Text variant="h6" className="font-bold">{temperature}°C</Text>
          <div className="flex items-center justify-between w-full mt-1">
            <Text className="text-xs text-blue-600">{temperatureMin}°</Text>
            <Text className="text-xs text-red-500">{temperatureMax}°</Text>
          </div>
          <Text className="text-xs mt-1 text-center capitalize truncate w-full" title={description}>
            {description}
          </Text>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrevisionJour;
