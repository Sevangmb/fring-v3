
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/Typography';
import { Shirt, Pants, SandwichIcon } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenueService';

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
  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
      <Text as="h3" variant="h4" className="mb-3">Suggestion de tenue</Text>
      <Text className="mb-4">{message}</Text>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Haut */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <Shirt className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Haut</Text>
          </div>
          {haut ? (
            <div className="flex items-center">
              {haut.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={haut.image_url} 
                    alt={haut.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <Shirt className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{haut.nom}</Text>
                {haut.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{haut.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucun haut disponible</Text>
          )}
        </div>
        
        {/* Bas */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <Pants className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Bas</Text>
          </div>
          {bas ? (
            <div className="flex items-center">
              {bas.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={bas.image_url} 
                    alt={bas.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <Pants className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{bas.nom}</Text>
                {bas.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{bas.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucun bas disponible</Text>
          )}
        </div>
        
        {/* Chaussures */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <SandwichIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Chaussures</Text>
          </div>
          {chaussures ? (
            <div className="flex items-center">
              {chaussures.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={chaussures.image_url} 
                    alt={chaussures.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <SandwichIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{chaussures.nom}</Text>
                {chaussures.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{chaussures.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucunes chaussures disponibles</Text>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TenueSuggestion;
