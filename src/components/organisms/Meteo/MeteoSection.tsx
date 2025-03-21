
import React from 'react';
import { useMeteo } from '@/hooks/useMeteo';
import MeteoActuelle from './MeteoActuelle';
import PrevisionJour from './PrevisionJour';
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/atoms/Typography";
import { AlertCircle } from 'lucide-react';

const MeteoSection: React.FC = () => {
  const { meteo, loading, error } = useMeteo();

  if (loading) {
    return (
      <div className="my-8">
        <Text variant="h3" className="mb-4">Météo</Text>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !meteo) {
    return (
      <div className="my-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
        <div className="flex justify-center items-center">
          <AlertCircle className="h-5 w-5 text-destructive mr-2" />
          <Text>Impossible de charger les données météo</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <Text variant="h3" className="mb-4">Météo pour les 3 prochains jours</Text>
      <div className="space-y-4">
        <MeteoActuelle 
          temperature={meteo.current.temperature}
          description={meteo.current.description}
          icon={meteo.current.icon}
          feelsLike={meteo.current.feelsLike}
          humidity={meteo.current.humidity}
          windSpeed={meteo.current.windSpeed}
          city={meteo.city}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {meteo.forecast.map((jour, index) => (
            <PrevisionJour
              key={index}
              date={jour.date}
              temperature={jour.temperature}
              temperatureMin={jour.temperatureMin}
              temperatureMax={jour.temperatureMax}
              description={jour.description}
              icon={jour.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeteoSection;
